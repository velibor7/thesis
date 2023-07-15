import json
from datetime import timedelta
from datetime import datetime, timezone
from flask import redirect, url_for, request, jsonify
from app import app, db
from app.models import User, Post, Like, Follow
from flask_jwt_extended import create_access_token,get_jwt,get_jwt_identity, \
                               unset_jwt_cookies, jwt_required, JWTManager
from flask_bcrypt import generate_password_hash



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
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

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
    if User.query.filter_by(username=username).first() is not None:
        return jsonify({'message': 'Username already exists'}), 409
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({'message': 'Email already exists'}), 409

    # Hash the password
    password_hash = generate_password_hash(password)

    # Create a new user record
    user = User(username=username, password_hash=password_hash, email=email)
    db.session.add(user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201