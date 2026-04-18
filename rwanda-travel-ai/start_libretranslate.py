"""
Script to start LibreTranslate server locally.
This will run the translation server on http://127.0.0.1:5000
"""
import subprocess
import sys

def start_libretranslate_server():
    """Start the LibreTranslate server."""
    print("="*60)
    print("Starting LibreTranslate Server")
    print("="*60)
    print("\nServer will be available at: http://127.0.0.1:5000")
    print("Press Ctrl+C to stop the server\n")
    print("="*60)
    
    try:
        # Start LibreTranslate server
        # --host 127.0.0.1: Listen on localhost
        # --port 5000: Use port 5000
        # --load-only: Only load specific languages (optional, for faster startup)
        subprocess.run([
            sys.executable, "-m", "libretranslate.main",
            "--host", "127.0.0.1",
            "--port", "5000"
        ])
    except KeyboardInterrupt:
        print("\n\nShutting down LibreTranslate server...")
        print("Server stopped successfully.")
    except Exception as e:
        print(f"\nError starting LibreTranslate server: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure libretranslate is installed: pip install libretranslate")
        print("2. Make sure language models are installed: python install_languages.py")
        print("3. Check if port 5000 is already in use")

if __name__ == "__main__":
    start_libretranslate_server()
