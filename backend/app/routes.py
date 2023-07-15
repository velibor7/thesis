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

@app.route('/posts', methods=['GET'])
@cross_origin()
def get_all_posts():
    posts = Post.query.all()
    post_list = []

    for post in posts:
        post_data = {
            'id': post.id,
            'content': post.content,
            # 'image_url': post.image_url,
            'image_url': url_for('static', filename=post.image_url),
            'user_id': post.user_id
        }
        post_list.append(post_data)
    print("post list: ")
    print(post_list)

    return jsonify(post_list)

@app.route('/posts', methods=['POST'])
@cross_origin()
@jwt_required()  # Requires authentication
def create_post():
    # Get the data from the request
    content = request.form.get('content')
    user_id = request.form.get('user_id')
    image_file = request.files.get('image')
    print(request.content_type)
    print("user_id ", request.form.get('user_id'))
    print("content ", request.form.get('content'))
    print(request.files.get('image'))

    # Check if an image file was provided
    if image_file is None:
        return jsonify({'message': 'No image file provided'}), 400

    # Securely save the uploaded file
    filename = secure_filename(image_file.filename)
    image_path = 'app/static/uploads/' + filename
    print(image_path)
    image_file.save(image_path)

    # Create a new post record
    new_post = Post(content=content, image_url=image_path, user_id=user_id)
    db.session.add(new_post)
    db.session.commit()

    return jsonify({'message': 'Post created successfully'}), 201

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
        return jsonify({'access_token': access_token}), 200
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

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    username = request.json.get('username')
    password = request.json.get('password')
    email = request.json.get('email')

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
    password_hash = generate_password_hash(password)
    new_user = User(username=username, password_hash=password_hash, email=email)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201