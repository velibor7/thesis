import json
from datetime import timedelta
from datetime import datetime, timezone
from flask import redirect, url_for, request, jsonify
from app import app, db
from app.models import User, Post, Like, Follow
from werkzeug.utils import secure_filename
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_cors import cross_origin



app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)


@app.route('/')
@cross_origin()
def home():
    # Logic to fetch and display posts on the home page
    posts = Post.query.all()
    return {"posts": []}

@app.route('/profile/<username>')
def profile(username):
    # Logic to fetch and display user profile based on the provided username
    user = User.query.filter_by(username=username).first()
    if user is None:
        return redirect(url_for('home'))
    return user.json()


@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    full_name = request.json.get('full_name')
    email = request.json.get('email')
    username = request.json.get('username')
    password = request.json.get('password')
    bio = request.json.get('bio')
    
    print(full_name)
    print(email)
    print(username)
    print(password)
    print(bio)


    # Check if the username or email already exists in the database
    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        if existing_user.username == username:
            return jsonify({'message': 'Username already exists'}), 409
        else:
            return jsonify({'message': 'Email already exists'}), 409

    # Create a new user record
    # password_hash = generate_password_hash(password)
    new_user = User(username=username, full_name=full_name, email=email, password=password, bio=bio)
    print(new_user.id)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201


@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get_or_404(user_id)

    follower_ids = [follower.follower_id for follower in user.followers]
    following_ids = [follower.follower_id for follower in user.following]

    user_data = {
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'profile_picture': user.profile_picture,
        'bio': user.bio,
        'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'post_count': len(user.posts),  # user.posts.count(),
        'follower_count': user.followers.count(),
        'following_count': user.following.count(),
        'follower_ids': follower_ids,
        'following_ids': following_ids
    }

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
            # 'profile_picture': user.profile_picture,
            'bio': user.bio,
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'post_count': len(user.posts),  # user.posts.count(),
            'follower_count': user.followers.count(),
            'following_count': user.following.count(),
            'follower_ids': follower_ids,
            'following_ids': following_ids
        }
        user_list.append(user_data)

    dumb_data = [
        {
            'id': 18,
            'username': 'random_username',
            'email': 'test18@email.com',
            # 'profile_picture': user.profile_picture,,
            'bio': 'this is my bio....',
            # 'created_at': '', #user.created_at.strftime('%Y-%m-%d %H:%M:%S'),,
            'post_count': 4,
            'follower_count': 421,
            'following_count': 150
        },
        {
            'id': 23,
            'username': 'random_username3',
            'email': 'test23email.com',
            # 'profile_picture': user.profile_picture,,
            'bio': 'this is my bio....',
            # 'created_at': '', #user.created_at.strftime('%Y-%m-%d %H:%M:%S'),,
            'post_count': 55,
            'follower_count': 42,
            'following_count': 50
        },
        {
            'id': 189,
            'username': 'random_username5555',
            'email': 'test555@email.com',
            # 'profile_picture': user.profile_picture,,
            'bio': 'this is my bio....',
            # 'created_at': '', #user.created_at.strftime('%Y-%m-%d %H:%M:%S'),,
            'post_count': 49,
            'follower_count': 91,
            'following_count': 1501
        },
        {
            'id': 1,
            'username': 'test_user',
            'email': 'test@test.com',
            # 'profile_picture': user.profile_picture,,
            'bio': 'this is my bio ...',
            # 'created_at': '', #user.created_at.strftime('%Y-%m-%d %H:%M:%S'),,
            'post_count': 495,
            'follower_count': 910,
            'following_count': 15
        }
    ]

    # return jsonify(dumb_data)
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

    # Securely save the uploaded file
    filename = secure_filename(image_file.filename)
    image_path = 'static/uploads/' + filename
    print("image_path when saving: " + image_path)
    image_file.save('app/' + image_path)

    new_post = Post(content=content, image_url=image_path, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully'}), 201

@app.route('/users/<int:current_user_id>/<int:user_to_follow_id>/follow', methods=['POST'])
@cross_origin()
def follow_user(current_user_id, user_to_follow_id):
    user_to_follow = User.query.get_or_404(user_to_follow_id)
    current_user = User.query.get_or_404(current_user_id)

    if current_user_id == user_to_follow_id:
        return jsonify({'message': 'Cannot follow yourself'})

    # Check if the current user is already following the target user
    existing_follow = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_to_follow_id).first()

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

    follow = Follow.query.filter_by(follower_id=current_user_id, followed_id=user_to_unfollow_id).first()

    if not follow:
        return jsonify({'message': 'Not following this user'})

    db.session.delete(follow)
    db.session.commit()

    return jsonify({'message': 'Successfully unfollowed user'})

@app.route('/token', methods=["POST"])
@cross_origin()
def create_token():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    print(username)
    print(password)
    if username != "test" or password != "test123":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=username)
    response = {"userId": 1, "token": access_token}
    return response


@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    # Retrieve the user from the database based on the provided username
    user = User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password_hash, password):
        # If the provided password matches the stored hash, generate an access token
        access_token = create_access_token(identity=user.username)

        # Return the access token as the response
        return jsonify({'userId': user.id, 'token': access_token}), 200
    else:
        # If the credentials are invalid, return an error message
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

