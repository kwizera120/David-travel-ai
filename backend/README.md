# OAuth Authentication System

A complete Python Flask application with Google and Facebook OAuth authentication.

## 📚 Libraries and Dependencies

### Core Flask Framework
- **Flask==2.3.3** - Main web framework for Python
  - Provides routing, templating, request handling
  - Manages application context and configuration

### Authentication & Session Management
- **Flask-Login==0.6.3** - User session management
  - Handles user login/logout sessions
  - Provides `@login_required` decorator for route protection
  - Manages user cookies and session data
  - Includes `UserMixin` for default user methods

### Database Integration
- **pymongo==4.6.0** - MongoDB driver for Python
  - Connects to MongoDB database
  - Provides CRUD operations (insert, find, update)
  - Handles MongoDB ObjectId conversions
  - Manages database connections and queries

### OAuth Authentication
- **authlib==1.2.1** - OAuth 2.0 client library
  - Integrates with Flask for OAuth flows
  - Supports multiple providers (Google, Facebook, GitHub, etc.)
  - Handles authorization code exchange and token management
  - Provides secure OAuth implementation

### Security & Password Management
- **Werkzeug==2.3.7** - Security utilities
  - `generate_password_hash()` - Creates secure password hashes (bcrypt)
  - `check_password_hash()` - Verifies password against stored hash
  - Provides secure password storage and validation

### HTTP Requests
- **requests==2.31.0** - HTTP client library
  - Used for external API calls during OAuth flows
  - Handles HTTPS requests to OAuth providers
  - Manages error handling for network requests

### Environment Configuration
- **python-dotenv==1.0.0** - Environment variable management
  - Loads configuration from `.env` files
  - Separates sensitive data from code
  - Provides development/production environment support

### Data Validation
- **re** (built-in) - Regular expression support
  - Used for email format validation
  - Validates user input patterns
  - Provides robust input checking

## Features

- ✅ Google OAuth 2.0 authentication
- ✅ Facebook OAuth 2.0 authentication
- ✅ User registration and login
- ✅ Session management
- ✅ User dashboard
- ✅ Profile management
- ✅ Responsive Bootstrap UI
- ✅ MongoDB database with PyMongo

## Setup Instructions

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your OAuth credentials:

```bash
cp .env.example .env
```

You need to get OAuth credentials from:

#### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:5000/authorize/google`
6. Copy Client ID and Client Secret to `.env`

#### Facebook OAuth Setup
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add Facebook Login product
4. Configure OAuth redirect URI: `http://localhost:5000/authorize/facebook`
5. Copy App ID and App Secret to `.env`

### 3. Run the Application

```bash
python app.py
```

The application will be available at `http://localhost:5000`

## Project Structure

```
authentication/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── templates/            # HTML templates
│   ├── base.html         # Base template
│   ├── index.html        # Home page
│   ├── login.html        # Login page
│   └── dashboard.html    # User dashboard
├── auth.db               # SQLite database (created automatically)
└── README.md             # This file
```

## API Endpoints

- `GET /` - Home page
- `GET /login` - Login page
- `GET /login/google` - Google OAuth login
- `GET /authorize/google` - Google OAuth callback
- `GET /login/facebook` - Facebook OAuth login
- `GET /authorize/facebook` - Facebook OAuth callback
- `GET /dashboard` - User dashboard (protected)
- `GET /logout` - Logout

## Database Schema

The application uses MongoDB with PyMongo. The `User` collection stores documents with:

- `_id` - MongoDB ObjectId (primary key)
- `email` - User email (unique)
- `name` - User display name
- `provider` - Authentication provider ('email', 'google', 'facebook')
- `provider_id` - OAuth provider user ID (null for email auth)
- `password_hash` - Secure password hash (only for email auth)
- `profile_picture` - Profile picture URL
- `created_at` - Account creation timestamp
- `last_login` - Last login timestamp

### MongoDB vs SQLite Differences
- **Document-based** vs Table-based storage
- **ObjectId** vs Integer primary keys
- **Flexible schema** vs Fixed columns
- **JSON-like queries** vs SQL queries
- **No migrations needed** vs SQLAlchemy migrations

## Security Features

- Secure session management with Flask-Login
- OAuth 2.0 implementation with Authlib
- CSRF protection
- Password hashing (not used with OAuth)
- Environment variable configuration

## Default Configuration

- Development server runs on `http://localhost:5000`
- SQLite database: `auth.db`
- Session timeout: Browser session
- Debug mode: Enabled

## Troubleshooting

### Common Issues

1. **OAuth Callback URLs**: Make sure the redirect URIs in your OAuth console match exactly:
   - Google: `http://localhost:5000/authorize/google`
   - Facebook: `http://localhost:5000/authorize/facebook`

2. **Environment Variables**: Ensure all required variables are set in `.env` file

3. **MongoDB Connection**: Ensure MongoDB is running and accessible at `mongodb://localhost:27017`

4. **Database Issues**: Check MongoDB logs and verify collection names if data issues occur

5. **Port Conflicts**: Change port in `app.py` if 5000 is already in use

### Development Tips

- Use `python -m flask run` for better development server
- Set `FLASK_ENV=development` for auto-reload
- Check browser console for JavaScript errors
- Review Flask logs for debugging information

## License

MIT License - feel free to use this code for your projects.
