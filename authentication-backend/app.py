# =============================================================================
# IMPORTS AND CONFIGURATION
# =============================================================================
# Core Flask and authentication imports
import os
import requests
from flask import Flask, render_template, request, redirect, url_for, session, flash
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user, login_required
from pymongo import MongoClient  # MongoDB driver
from bson.objectid import ObjectId  # MongoDB ObjectId handling
from authlib.integrations.flask_client import OAuth  # OAuth integration
from dotenv import load_dotenv  # Environment variable management
from datetime import datetime  # Date/time handling
from werkzeug.security import generate_password_hash, check_password_hash  # Password security
from re import match  # Email validation regex

# Load environment variables from .env file
load_dotenv()

# =============================================================================
# FLASK APPLICATION SETUP
# =============================================================================
app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# =============================================================================
# MONGODB DATABASE CONFIGURATION
# =============================================================================
# Connect to MongoDB using connection string from environment
MONGO_URI = os.getenv('DATABASE_URL', 'mongodb://localhost:27017/auth')
client = MongoClient(MONGO_URI)
db = client.get_database()  # Get the 'auth' database
users_collection = db.users  # Reference to the 'users' collection
# =============================================================================
# FLASK-LOGIN MANAGER SETUP
# =============================================================================
# Configure Flask-Login for session management
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'  # Redirect to login page for protected routes

# =============================================================================
# OAUTH PROVIDER CONFIGURATION
# =============================================================================
# Initialize OAuth for social login providers
oauth = OAuth(app)

# -----------------------------------------------------------------------------
# Google OAuth Configuration
# -----------------------------------------------------------------------------
# Uses OpenID Connect for secure authentication
google = oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),  # From Google Cloud Console
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),  # From Google Cloud Console
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'},  # Request user profile data
    request_timeout=30  # Connection timeout in seconds
)

# -----------------------------------------------------------------------------
# Facebook OAuth Configuration
# -----------------------------------------------------------------------------
# Uses Facebook Graph API for authentication
facebook = oauth.register(
    name='facebook',
    client_id=os.getenv('FACEBOOK_APP_ID'),  # From Facebook Developers
    client_secret=os.getenv('FACEBOOK_APP_SECRET'),  # From Facebook Developers
    access_token_url='https://graph.facebook.com/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    client_kwargs={'scope': 'email public_profile'},  # Request basic profile info
    request_timeout=30  # Connection timeout in seconds
)

# =============================================================================
# USER MODEL CLASS
# =============================================================================
# Custom User class that works with both MongoDB and Flask-Login
class User(UserMixin):
    """
    User model for MongoDB + Flask-Login integration.
    Inherits from UserMixin to provide Flask-Login compatibility.
    """
    
    def __init__(self, user_data):
        """
        Initialize User from MongoDB document.
        user_data: dict - MongoDB user document
        """
        self.id = str(user_data['_id'])  # Convert ObjectId to string for Flask-Login
        self.email = user_data['email']
        self.name = user_data['name']
        self.password_hash = user_data.get('password_hash')  # Only for email auth users
        self.provider = user_data.get('provider', 'email')  # Default to email auth
        self.provider_id = user_data.get('provider_id')  # OAuth provider user ID
        self.profile_picture = user_data.get('profile_picture')  # Profile image URL
        self.created_at = user_data.get('created_at', datetime.utcnow())
        self.last_login = user_data.get('last_login', datetime.utcnow())

    def set_password(self, password):
        """
        Hash and set user password using Werkzeug's secure hashing.
        Uses bcrypt under the hood for strong security.
        """
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        """
        Verify password against stored hash.
        Returns True if password matches, False otherwise.
        """
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        """
        Convert User object to dictionary for MongoDB storage.
        Useful for serialization and debugging.
        """
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

# =============================================================================
# FLASK-LOGIN USER LOADER
# =============================================================================
@login_manager.user_loader
def load_user(user_id):
    """
    Flask-Login callback to load user from session.
    Called when user visits protected routes.
    Returns User object if found, None otherwise.
    """
    # Convert string ID back to ObjectId for MongoDB query
    user_data = users_collection.find_one({'_id': ObjectId(user_id)})
    if user_data:
        return User(user_data)
    return None

# =============================================================================
# WEB ROUTES
# =============================================================================
# -----------------------------------------------------------------------------
# Home Page
# -----------------------------------------------------------------------------
@app.route('/')
def index():
    """
    Home page - displays authentication options.
    Shows different content for authenticated vs anonymous users.
    """
    return render_template('index.html')

# -----------------------------------------------------------------------------
# Login Page
# -----------------------------------------------------------------------------
@app.route('/login')
def login():
    """
    Display login form with email/password and OAuth options.
    GET request shows the login page.
    """
    return render_template('login.html')

# -----------------------------------------------------------------------------
# Registration Page
# -----------------------------------------------------------------------------
@app.route('/register')
def register():
    """
    Display user registration form.
    GET request shows the registration page.
    """
    return render_template('register.html')

# -----------------------------------------------------------------------------
# Registration Form Handler
# -----------------------------------------------------------------------------
@app.route('/register', methods=['POST'])
def register_post():
    """
    Process user registration form.
    Validates input, checks for existing users, creates new user account.
    POST request handles form submission.
    """
    # Extract and sanitize form data
    name = request.form.get('name', '').strip()
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '')
    confirm_password = request.form.get('confirm_password', '')
    
    # =============================================================================
    # INPUT VALIDATION
    # =============================================================================
    errors = []
    
    # Name validation - must be at least 2 characters
    if not name or len(name) < 2:
        errors.append('Name must be at least 2 characters long')
    
    # Email validation using regex pattern
    if not email or not match(r'^[^@]+@[^@]+\.[^@]+$', email):
        errors.append('Please enter a valid email address')
    
    # Password validation - minimum 6 characters
    if not password or len(password) < 6:
        errors.append('Password must be at least 6 characters long')
    
    # Password confirmation check
    if password != confirm_password:
        errors.append('Passwords do not match')
    
    # =============================================================================
    # DUPLICATE USER CHECK
    # =============================================================================
    # Check if email already exists in MongoDB
    if users_collection.find_one({'email': email}):
        errors.append('An account with this email already exists')
    
    # If validation errors exist, show them and redirect back
    if errors:
        for error in errors:
            flash(error, 'error')
        return redirect(url_for('register'))
    
    # =============================================================================
    # CREATE NEW USER
    # =============================================================================
    # Prepare user document for MongoDB insertion
    user_data = {
        'name': name,
        'email': email,
        'provider': 'email',  # Email-based authentication
        'provider_id': None,  # No OAuth provider ID
        'password_hash': generate_password_hash(password),  # Secure password hashing
        'created_at': datetime.utcnow(),
        'last_login': datetime.utcnow()
    }
    
    # Insert into MongoDB and get the inserted ID
    result = users_collection.insert_one(user_data)
    user_data['_id'] = result.inserted_id
    
    flash('Account created successfully! Please log in.', 'success')
    return redirect(url_for('login'))

# -----------------------------------------------------------------------------
# Email/Password Login Handler
# -----------------------------------------------------------------------------
@app.route('/login', methods=['POST'])
def login_post():
    """
    Process email/password login form.
    Validates credentials and creates user session.
    POST request handles form submission.
    """
    # Extract and sanitize form data
    email = request.form.get('email', '').strip().lower()
    password = request.form.get('password', '')
    
    # Basic input validation
    if not email or not password:
        flash('Please enter both email and password', 'error')
        return redirect(url_for('login'))
    
    # =============================================================================
    # USER AUTHENTICATION
    # =============================================================================
    # Find user by email and provider type (email-based auth)
    user_data = users_collection.find_one({'email': email, 'provider': 'email'})
    
    # Verify user exists and password is correct
    if not user_data or not check_password_hash(user_data['password_hash'], password):
        flash('Invalid email or password', 'error')
        return redirect(url_for('login'))
    
    # =============================================================================
    # UPDATE LAST LOGIN AND CREATE SESSION
    # =============================================================================
    # Update last login timestamp in MongoDB
    users_collection.update_one(
        {'_id': user_data['_id']},
        {'$set': {'last_login': datetime.utcnow()}}
    )
    
    # Create Flask-Login session
    user = User(user_data)
    login_user(user)
    flash('Welcome back!', 'success')
    return redirect(url_for('dashboard'))

# -----------------------------------------------------------------------------
# User Dashboard
# -----------------------------------------------------------------------------
@app.route('/dashboard')
@login_required
def dashboard():
    """
    Protected user dashboard page.
    Requires user to be authenticated via @login_required decorator.
    Shows user profile information and account details.
    """
    return render_template('dashboard.html', user=current_user)

# -----------------------------------------------------------------------------
# Logout Handler
# -----------------------------------------------------------------------------
@app.route('/logout')
@login_required
def logout():
    """
    Logout user and clear session.
    Requires user to be authenticated.
    Redirects to home page after logout.
    """
    logout_user()  # Clear Flask-Login session
    flash('You have been logged out successfully.', 'success')
    return redirect(url_for('index'))

# =============================================================================
# GOOGLE OAUTH AUTHENTICATION FLOW
# =============================================================================
# -----------------------------------------------------------------------------
# Google OAuth Login Initiation
# -----------------------------------------------------------------------------
@app.route('/login/google')
def login_google():
    """
    Initiate Google OAuth authentication flow.
    Redirects user to Google for authentication.
    Includes error handling for network/SSL issues.
    """
    try:
        redirect_uri = url_for('authorize_google', _external=True)
        return google.authorize_redirect(redirect_uri)
    except Exception as e:
        # Handle network/SSL errors gracefully
        flash('Google OAuth is not available at the moment. Please try another login method.', 'error')
        return redirect(url_for('login'))

# -----------------------------------------------------------------------------
# Google OAuth Callback Handler
# -----------------------------------------------------------------------------
@app.route('/authorize/google')
def authorize_google():
    """
    Handle Google OAuth callback.
    Processes authorization code, exchanges for access token,
    retrieves user info, creates/updates user account.
    """
    try:
        # Exchange authorization code for access token
        token = google.authorize_access_token()
        user_info = token.get('userinfo')
        
        if not user_info:
            flash('Failed to get user information from Google.', 'error')
            return redirect(url_for('login'))
        
        # =============================================================================
        # GOOGLE USER LOOKUP AND CREATION
        # =============================================================================
        # Check if user already exists from previous Google login
        user_data = users_collection.find_one({'provider': 'google', 'provider_id': user_info['sub']})
        
        if not user_data:
            # Check if email already exists with different provider
            existing_user = users_collection.find_one({'email': user_info['email']})
            if existing_user:
                flash('An account with this email already exists. Please login using your existing method.', 'error')
                return redirect(url_for('login'))
            
            # Create new user from Google OAuth data
            user_data = {
                'email': user_info['email'],
                'name': user_info['name'],
                'provider': 'google',
                'provider_id': user_info['sub'],  # Google's unique user ID
                'profile_picture': user_info.get('picture'),  # Google profile image
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow()
            }
            
            result = users_collection.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            flash('Account created successfully!', 'success')
        else:
            # Existing user - update last login timestamp
            users_collection.update_one(
                {'_id': user_data['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            flash('Welcome back!', 'success')
        
        # Create Flask-Login session and redirect to dashboard
        user = User(user_data)
        login_user(user)
        return redirect(url_for('dashboard'))
        
    except Exception as e:
        # Handle any OAuth errors gracefully
        flash('Google authentication failed. Please try again or use another login method.', 'error')
        return redirect(url_for('login'))

# =============================================================================
# FACEBOOK OAUTH AUTHENTICATION FLOW
# =============================================================================
# -----------------------------------------------------------------------------
# Facebook OAuth Login Initiation
# -----------------------------------------------------------------------------
@app.route('/login/facebook')
def login_facebook():
    """
    Initiate Facebook OAuth authentication flow.
    Redirects user to Facebook for authentication.
    Includes error handling for network/SSL issues.
    """
    try:
        redirect_uri = url_for('authorize_facebook', _external=True)
        return facebook.authorize_redirect(redirect_uri)
    except Exception as e:
        # Handle network/SSL errors gracefully
        flash('Facebook OAuth is not available at the moment. Please try another login method.', 'error')
        return redirect(url_for('login'))

# -----------------------------------------------------------------------------
# Facebook OAuth Callback Handler
# -----------------------------------------------------------------------------
@app.route('/authorize/facebook')
def authorize_facebook():
    """
    Handle Facebook OAuth callback.
    Processes authorization code, exchanges for access token,
    retrieves user info via Graph API, creates/updates user account.
    """
    try:
        # Exchange authorization code for access token
        token = facebook.authorize_access_token()
        
        # Get user information from Facebook Graph API
        response = facebook.get('https://graph.facebook.com/me?fields=id,name,email,picture')
        user_info = response.json()
        
        if not user_info or 'id' not in user_info:
            flash('Failed to get user information from Facebook.', 'error')
            return redirect(url_for('login'))
        
        # =============================================================================
        # FACEBOOK USER LOOKUP AND CREATION
        # =============================================================================
        # Check if user already exists from previous Facebook login
        user_data = users_collection.find_one({'provider': 'facebook', 'provider_id': user_info['id']})
        
        if not user_data:
            # Check if email already exists with different provider
            # Facebook may not always provide email, so create fallback
            email = user_info.get('email', f"{user_info['id']}@facebook.com")
            existing_user = users_collection.find_one({'email': email})
            if existing_user:
                flash('An account with this email already exists. Please login using your existing method.', 'error')
                return redirect(url_for('login'))
            
            # Create new user from Facebook OAuth data
            user_data = {
                'email': email,
                'name': user_info['name'],
                'provider': 'facebook',
                'provider_id': user_info['id'],  # Facebook's unique user ID
                'profile_picture': user_info.get('picture', {}).get('data', {}).get('url'),  # FB profile image
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow()
            }
            
            result = users_collection.insert_one(user_data)
            user_data['_id'] = result.inserted_id
            flash('Account created successfully!', 'success')
        else:
            # Existing user - update last login timestamp
            users_collection.update_one(
                {'_id': user_data['_id']},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            flash('Welcome back!', 'success')
        
        # Create Flask-Login session and redirect to dashboard
        user = User(user_data)
        login_user(user)
        return redirect(url_for('dashboard'))
        
    except Exception as e:
        # Handle any OAuth errors gracefully
        flash('Facebook authentication failed. Please try again or use another login method.', 'error')
        return redirect(url_for('login'))

# =============================================================================
# APPLICATION STARTUP
# =============================================================================
if __name__ == '__main__':
    """
    Start the Flask development server.
    Runs in debug mode for development.
    Server accessible at http://localhost:5000
    """
    app.run(debug=True)
