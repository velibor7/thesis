import json
from datetime import timedelta
from datetime import datetime, timezone
from flask import redirect, url_for, request, jsonify
from app import app, db
from app.models import User, Post, Like, Follow
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, \
    unset_jwt_cookies, jwt_required, JWTManager
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_cors import cross_origin

from .util.push_to_s3 import push_image_to_s3, push_image_to_s3_with_path


app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)


@app.route('/')
@cross_origin()
def home():
    # Logic to fetch and display posts on the home page
    posts = Post.query.all()
    return {"posts": []}


@app.route('/users/<int:user_id>', methods=['GET'])
@cross_origin()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    follower_ids = [follower.follower_id for follower in user.followers]
    following_ids = [follower.followed_id for follower in user.following]

    user_data = {
        'id': user.id,
        'username': user.username,
        'full_name': user.full_name,
        'email': user.email,
        'profile_picture': user.profile_picture,
        'bio': user.bio,
        'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'post_count': len(user.posts),  # user.posts.count(),
        'follower_count': user.followers.count(),
        'following_count': user.following.count(),
        'follower_ids': follower_ids,
        'following_ids': following_ids,
        'posts': []
    }

    for post in user.posts:
        post_data = {
            'id': post.id,
            'image_url': post.image_url,
            'content': post.content,
            # 'created_at': post.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        user_data['posts'].append(post_data)

    return jsonify(user_data)


@app.route('/users', methods=['GET'])
@cross_origin()
def get_all_users():
    users = User.query.all()
    user_list = []

    for user in users:
        follower_ids = [follower.follower_id for follower in user.followers]
        following_ids = [follower.follower_id for follower in user.following]
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'bio': user.bio,
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'post_count': len(user.posts),  # user.posts.count(),
            'follower_count': user.followers.count(),
            'following_count': user.following.count(),
            'follower_ids': follower_ids,
            'following_ids': following_ids
        }
        user_list.append(user_data)

    return jsonify(user_list)


@app.route('/posts', methods=['GET'])
@cross_origin()
def get_all_posts():
    posts = Post.query.all()
    post_list = []

    for post in posts:
        post_data = {
            'id': post.id,
            'content': post.content,
            'image_url': post.image_url,
            # 'image_url': url_for('static', filename=post.image_url),
            'user_id': post.user_id
        }
        post_list.append(post_data)
        print(f"post id: {post.id}; image_url: {post.image_url}")

    return jsonify(post_list)


@app.route('/posts', methods=['POST'])
@cross_origin()
@jwt_required()
def create_post():
    content = request.form.get('content')
    user_id = request.form.get('user_id')
    image_file = request.files.get('image')

    if image_file is None:
        return jsonify({'message': 'No image file provided'}), 400

    filename = secure_filename(image_file.filename)

    image_path = 'static/uploads/' + filename
    print("image_path when saving: " + image_path)
    image_file.save('app/' + image_path)

    # ! pushing image to s3 after it is saved
    push_image_to_s3_with_path(user_id, f'app/{image_path}', filename)

    new_post = Post(content=content, image_url=image_path, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully'}), 201


@app.route('/users/<int:user_id>/followers', methods=['GET'])
@cross_origin()
def get_followers(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    followers = Follow.query.filter_by(followed_id=user_id).all()

    follower_ids = [follower.follower_id for follower in followers]

    follower_info = User.query.filter(User.id.in_(follower_ids)).all()

    response_data = [
        {
            'id': follower.id,
            'username': follower.username,
            'email': follower.email
        }
        for follower in follower_info
    ]

    return jsonify({'followers': response_data})


@app.route('/users/<int:current_user_id>/<int:user_to_follow_id>/follow', methods=['POST'])
@cross_origin()
def follow_user(current_user_id, user_to_follow_id):
    user_to_follow = User.query.get_or_404(user_to_follow_id)
    current_user = User.query.get_or_404(current_user_id)

    if current_user_id == user_to_follow_id:
        return jsonify({'message': 'Cannot follow yourself'})

    # Check if the current user is already following the target user
    existing_follow = Follow.query.filter_by(
        follower_id=current_user_id, followed_id=user_to_follow_id).first()

    if existing_follow:
        return jsonify({'message': 'Already following this user'})

    follow = Follow(follower_id=current_user_id, followed_id=user_to_follow_id)
    db.session.add(follow)
    db.session.commit()

    return jsonify({'message': 'Successfully followed user'})


@app.route('/users/<int:current_user_id>/<int:user_to_unfollow_id>/unfollow', methods=['POST'])
@cross_origin()
def unfollow_user(current_user_id, user_to_unfollow_id):
    user_to_unfollow = User.query.get_or_404(user_to_unfollow_id)
    current_user = User.query.get_or_404(current_user_id)

    if current_user_id == user_to_unfollow_id:
        return jsonify({'message': 'Cannot unfollow yourself'})

    follow = Follow.query.filter_by(
        follower_id=current_user_id, followed_id=user_to_unfollow_id).first()

    if not follow:
        return jsonify({'message': 'Not following this user'})

    db.session.delete(follow)
    db.session.commit()

    return jsonify({'message': 'Successfully unfollowed user'})


@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    full_name = request.json.get('full_name')
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    bio = request.json.get('bio')

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        if existing_user.username == username:
            return jsonify({'message': 'Username already exists'}), 409
        else:
            return jsonify({'message': 'Email already exists'}), 409

    new_user = User(username=username, full_name=full_name,
                    email=email, password=password, bio=bio)
    print(new_user.id)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        access_token = create_access_token(identity=user.username)

        return jsonify({'userId': user.id, 'token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401


@app.route("/logout", methods=["POST"])
@cross_origin()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        # Case where there is not a valid JWT. Just return the original respone
        return response
