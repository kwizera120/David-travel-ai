from app import app

with app.app_context():
    redirect_uri = app.url_for('authorize_google', _external=True)
    print(f"Exact redirect URI: {redirect_uri}")
