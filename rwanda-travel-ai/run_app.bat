@echo off
echo ============================================
echo Rwanda Travel AI - Starting Application
echo ============================================
echo.

REM Check if language models are installed
echo Checking for language models...
python -c "import argostranslate.package; pkgs = argostranslate.package.get_installed_packages(); exit(0 if len(pkgs) > 0 else 1)" 2>nul

if errorlevel 1 (
    echo.
    echo WARNING: No language models detected!
    echo Installing language models... This may take a few minutes.
    echo.
    python install_languages.py
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install language models.
        echo Please run: python install_languages.py
        pause
        exit /b 1
    )
) else (
    echo Language models found!
)

echo.
echo ============================================
echo Starting FastAPI Backend Server
echo ============================================
echo.
echo Server will be available at: http://localhost:8000
echo Translation feature is integrated in the backend
echo.
echo Press Ctrl+C to stop the server
echo ============================================
echo.

uvicorn backend.main:app --reload --port 8000

pause
