# Google OAuth Setup Guide

## 🔧 Step-by-Step Instructions to Generate Google OAuth Credentials

### 1. Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click the project dropdown at the top
   - Click "NEW PROJECT"
   - Enter project name: `Flask Auth System`
   - Click "CREATE"

### 2. Enable Required APIs

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"

2. **Enable OAuth APIs**
   - Search for "Google+ API" and enable it
   - Search for "Google Identity" and enable it
   - Search for "OpenID Connect" and enable it

### 3. Create OAuth 2.0 Credentials

1. **Go to Credentials Page**
   - Click "APIs & Services" → "Credentials"
   - Click "+ CREATE CREDENTIALS" → "OAuth client ID"

2. **Configure OAuth Consent Screen** (if first time)
   - Choose "External" for User Type
   - Click "CREATE"
   - Fill in required fields:
     - **App name**: Flask Auth System
     - **User support email**: your-email@gmail.com
     - **Developer contact information**: your-email@gmail.com
   - Click "SAVE AND CONTINUE" through all steps

3. **Create OAuth Client ID**
   - **Application type**: Web application
   - **Name**: Flask Auth Client
   - **Authorized redirect URIs**:
     ```
     http://localhost:5000/authorize/google
     ```
   - Click "CREATE"

### 4. Get Your Credentials

After creation, you'll see:
- **Client ID**: Something like `123456789-abcdef.apps.googleusercontent.com`
- **Client Secret**: Something like `GOCSPX-abcdef123456789`

### 5. Configure Environment Variables

Create `.env` file in your project root:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Other existing variables
SECRET_KEY=your-secret-key-here
FLASK_ENV=development
DATABASE_URL=mongodb://localhost:27017/auth
BASE_URL=http://localhost:5000
```

### 6. Test the Setup

1. **Restart your Flask app**
   ```bash
   python app.py
   ```

2. **Test Google Login**
   - Go to http://localhost:5000
   - Click "Login with Google"
   - Should redirect to Google for authentication

## 🔍 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" Error**
   - Make sure redirect URI in Google Console exactly matches:
   - `http://localhost:5000/authorize/google`

2. **"invalid_client" Error**
   - Double-check Client ID and Client Secret in `.env`
   - Ensure no extra spaces or quotes

3. **"access_denied" Error**
   - Make sure OAuth consent screen is configured
   - Check that required APIs are enabled

4. **Network/SSL Errors**
   - The app has error handling built-in
   - Try again or use email/password login

## 📋 Required Redirect URIs

Add these exact URIs to your Google OAuth client:

```
http://localhost:5000/authorize/google
```

For production, you'll need:
```
https://yourdomain.com/authorize/google
```

## 🛡️ Security Notes

- Keep your Client Secret private and never commit to Git
- Use environment variables, not hardcoded values
- Restrict your OAuth client to specific domains in production
- Regularly rotate your secrets for better security

## 🚀 Next Steps

Once Google OAuth is working:
1. Test user registration and login flow
2. Verify user data is stored in MongoDB
3. Test the dashboard with authenticated users
4. Set up Facebook OAuth following similar steps
