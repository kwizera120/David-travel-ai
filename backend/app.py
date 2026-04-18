# =============================================================================
# IMPORTS AND CONFIGURATION
# =============================================================================
import os
import requests
from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from pymongo import MongoClient
from bson.objectid import ObjectId
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from re import match
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SESSION_COOKIE_SECURE'] = os.getenv('FLASK_ENV') == 'production'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'

# Enable CORS for frontend (adjust origins for production)
CORS(app, supports_credentials=True, origins=[
    'http://localhost:5173',
    'http://localhost:3000',
    os.getenv('FRONTEND_URL', '')
])

# =============================================================================
# MONGODB CONFIGURATION
# =============================================================================
MONGO_URI = os.getenv('DATABASE_URL')
if not MONGO_URI:
    raise ValueError("DATABASE_URL environment variable is required")

client = MongoClient(MONGO_URI)
db = client.get_database()  # uses database name from connection string
users_collection = db.users

# =============================================================================
# FLASK-LOGIN SETUP
# =============================================================================
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# =============================================================================
# OAUTH PROVIDERS
# =============================================================================
oauth = OAuth(app)

# Google
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},
    request_timeout=30
)

# Facebook
facebook = oauth.register(
    name='facebook',
    client_id=os.getenv('FACEBOOK_APP_ID'),
    client_secret=os.getenv('FACEBOOK_APP_SECRET'),
    access_token_url='https://graph.facebook.com/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    client_kwargs={'scope': 'email public_profile'},
    request_timeout=30
)

# =============================================================================
# USER MODEL
# =============================================================================
class User(UserMixin):
    def __init__(self, user_data):
        self.id = str(user_data['_id'])
        self.email = user_data['email']
        self.name = user_data['name']
        self.password_hash = user_data.get('password_hash')
        self.provider = user_data.get('provider', 'email')
        self.provider_id = user_data.get('provider_id')
        self.profile_picture = user_data.get('profile_picture')
        self.created_at = user_data.get('created_at', datetime.utcnow())
        self.last_login = user_data.get('last_login', datetime.utcnow())

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'email': self.email,
            'name': self.name,
            'password_hash': self.password_hash,
            'provider': self.provider,
            'provider_id': self.provider_id,
            'profile_picture': self.profile_picture,
            'created_at': self.created_at,
            'last_login': self.last_login
        }

@login_manager.user_loader
def load_user(user_id):
    user_data = users_collection.find_one({'_id': ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

# =============================================================================
# ROUTES
# =============================================================================
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/register')
def register():
    return render_template('register.html')

@app.route('/register', methods=['POST'])
def register_post():
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '')
    confirm_password = request.form.get('confirm_password', '')

    errors = []
    if not name or len(name) < 2:
        errors.append('Name must be at least 2 characters long')
    if not email or not match(r'^[^@]+@[^@]+\.[^@]+$', email):
        errors.append('Please enter a valid email address')
    if not password or len(password) < 6:
        errors.append('Password must be at least 6 characters long')
    if password != confirm_password:
        errors.append('Passwords do not match')
    if users_collection.find_one({'email': email}):
        errors.append('An account with this email already exists')

    if errors:
        for error in errors:
            flash(error, 'error')
        return redirect(url_for('register'))

    user_data = {
        'name': name,
        'email': email,
        'provider': 'email',
        'provider_id': None,
        'password_hash': generate_password_hash(password),
        'created_at': datetime.utcnow(),
        'last_login': datetime.utcnow()
    }

    result = users_collection.insert_one(user_data)
    user_data['_id'] = result.inserted_id

    flash('Account created successfully! Please log in.', 'success')
    return redirect(url_for('login'))

@app.route('/login', methods=['POST'])
def login_post():
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '')

    if not email or not password:
        flash('Please enter both email and password', 'error')
        return redirect(url_for('login'))

    user_data = users_collection.find_one({'email': email, 'provider': 'email'})
    if not user_data or not check_password_hash(user_data['password_hash'], password):
        flash('Invalid email or password', 'error')
        return redirect(url_for('login'))

    users_collection.update_one(
        {'_id': user_data['_id']},
        {'$set': {'last_login': datetime.utcnow()}}
    )

    user = User(user_data)
    login_user(user)
    flash('Welcome back!', 'success')
    return redirect(url_for('dashboard'))

@app.route('/dashboard')
@login_required
def dashboard():
    return render_template('dashboard.html', user=current_user)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))

# =============================================================================
# GOOGLE OAUTH
# =============================================================================
@app.route('/login/google')
def login_google():
    try:
        scheme = 'https' if os.getenv('FLASK_ENV') == 'production' else 'http'
        redirect_uri = url_for('authorize_google', _external=True, _scheme=scheme)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        flash('Google OAuth is not available at the moment.', 'error')
        return redirect(url_for('login'))

@app.route('/authorize/google')
def authorize_google():
    try:
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        if not user_info:
            flash('Failed to get user information from Google.', 'error')
            return redirect(url_for('login'))

        user_data = users_collection.find_one({'provider': 'google', 'provider_id': user_info['sub']})
        if not user_data:
            existing_user = users_collection.find_one({'email': user_info['email']})
            if existing_user:
                flash('An account with this email already exists.', 'error')
                return redirect(url_for('login'))

            user_data = {
                'email': user_info['email'],
                'name': user_info['name'],
                'provider': 'google',
                'provider_id': user_info['sub'],
                'profile_picture': user_info.get('picture'),
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow()
            }
            result = users_collection.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            flash('Account created successfully!', 'success')
        else:
            users_collection.update_one(
                {'_id': user_data['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            flash('Welcome back!', 'success')

        user = User(user_data)
        login_user(user)
        return redirect(url_for('dashboard'))
    except Exception as e:
        flash('Google authentication failed.', 'error')
        return redirect(url_for('login'))

# =============================================================================
# FACEBOOK OAUTH
# =============================================================================
@app.route('/login/facebook')
def login_facebook():
    try:
        scheme = 'https' if os.getenv('FLASK_ENV') == 'production' else 'http'
        redirect_uri = url_for('authorize_facebook', _external=True, _scheme=scheme)
        return facebook.authorize_redirect(redirect_uri)
    except Exception as e:
        flash('Facebook OAuth is not available at the moment.', 'error')
        return redirect(url_for('login'))

@app.route('/authorize/facebook')
def authorize_facebook():
    try:
        token = facebook.authorize_access_token()
        response = facebook.get('https://graph.facebook.com/me?fields=id,name,email,picture')
        user_info = response.json()
        if not user_info or 'id' not in user_info:
            flash('Failed to get user information from Facebook.', 'error')
            return redirect(url_for('login'))

        user_data = users_collection.find_one({'provider': 'facebook', 'provider_id': user_info['id']})
        if not user_data:
            email = user_info.get('email', f"{user_info['id']}@facebook.com")
            existing_user = users_collection.find_one({'email': email})
            if existing_user:
                flash('An account with this email already exists.', 'error')
                return redirect(url_for('login'))

            user_data = {
                'email': email,
                'name': user_info['name'],
                'provider': 'facebook',
                'provider_id': user_info['id'],
                'profile_picture': user_info.get('picture', {}).get('data', {}).get('url'),
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow()
            }
            result = users_collection.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            flash('Account created successfully!', 'success')
        else:
            users_collection.update_one(
                {'_id': user_data['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            flash('Welcome back!', 'success')

        user = User(user_data)
        login_user(user)
        return redirect(url_for('dashboard'))
    except Exception as e:
        flash('Facebook authentication failed.', 'error')
        return redirect(url_for('login'))

# =============================================================================
# PRODUCTION STARTUP (for Render)
# =============================================================================
if __name__ == '__main__':
    # Only used for local development
    if os.getenv('FLASK_ENV') == 'development':
        app.run(debug=True, host='127.0.0.1', port=5000)
