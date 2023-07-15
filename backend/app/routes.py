import json
from datetime import timedelta
from datetime import datetime, timezone
from flask import redirect, url_for, request, jsonify
from app import app, db
from app.models import User, Post, Like, Follow
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_bcrypt import generate_password_hash, check_password_hash
from flask_cors import cross_origin



app.config["JWT_SECRET_KEY"] = "please-remember-to-change-me"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)


@app.route('/')
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

@app.route('/upload', methods=['GET', 'POST'])
@jwt_required()
def upload():
    # Logic to handle image upload form submission
    if request.method == 'POST':
        # Handle the uploaded image and save it to the storage service (e.g., Amazon S3)
        # Retrieve the image URL or path and store it in the database
        # Create a new post entry for the user

        return redirect(url_for('home'))
    
    return {}  # render_template('upload.html')

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