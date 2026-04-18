# Translation Feature Setup Guide

This guide explains how to set up and use the translation feature in the Rwanda Travel AI application.

## Overview

The translation feature uses:
- **LibreTranslate**: Open-source translation API
- **Argos Translate**: Offline translation engine with language models
- **Backend Integration**: Translation endpoints in FastAPI
- **Frontend Widget**: Universal translator in the UI

## Setup Instructions

### 1. Install Dependencies

First, make sure all required packages are installed:

```bash
pip install -r requirements.txt
```

This will install:
- `libretranslate` - Translation server
- `argostranslate` - Translation engine
- All other project dependencies

### 2. Install Language Models

Run the language installation script to download translation models:

```bash
python install_languages.py
```

This script will:
- Download and install language packages for multiple language pairs
- Support translations between English, French, Spanish, German, Italian, Portuguese, Arabic, Russian, Chinese, and Japanese
- Display progress and confirmation of installed packages

**Note**: The first run may take several minutes as it downloads language models (several hundred MB).

### 3. Start the Application

You have two options for running the translation feature:

#### Option A: Using Backend Translation (Recommended)

The backend now includes translation endpoints that use the installed Argos Translate models directly. This is the simplest approach:

1. Start the FastAPI backend server:
```bash
uvicorn backend.main:app --reload --port 8000
```

2. Open your browser to `http://localhost:8000`

3. The translation widget will use the backend `/translate` and `/detect` endpoints

**Advantages**:
- No separate server needed
- Uses local translation models
- Faster and more reliable
- Works offline

#### Option B: Using LibreTranslate Server (Alternative)

If you prefer to run a separate LibreTranslate server:

1. Start the LibreTranslate server (in a separate terminal):
```bash
python start_libretranslate.py
```

This will start LibreTranslate on `http://127.0.0.1:5000`

2. Start the FastAPI backend (in another terminal):
```bash
uvicorn backend.main:app --reload --port 8000
```

3. Open your browser to `http://localhost:8000`

## Using the Translation Feature

### In the Web Interface

1. Click the **translator toggle button** (speech bubble icon) in the bottom-right corner
2. Enter text in the source text area
3. Select your target language from the dropdown
4. Click **Translate** or the language will auto-translate when you change the selection
5. The detected source language and translated text will appear

### Supported Languages

- English (en)
- French (fr)
- Kinyarwanda (rw) - *if available*
- Swahili (sw) - *if available*
- Spanish (es)
- German (de)
- Italian (it)
- Portuguese (pt)
- Arabic (ar)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)

**Note**: Kinyarwanda and Swahili support depends on available Argos Translate packages. The system will fall back to online services if local models aren't available.

## API Endpoints

### POST /translate

Translate text from one language to another.

**Request Body**:
```json
{
  "text": "Hello, how are you?",
  "source_lang": "auto",
  "target_lang": "fr"
}
```

**Response**:
```json
{
  "translatedText": "Bonjour, comment allez-vous?",
  "success": true
}
```

### POST /detect

Detect the language of provided text.

**Request Body**:
```json
{
  "text": "Bonjour le monde"
}
```

**Response**:
```json
[
  {
    "language": "fr",
    "confidence": 1.0
  }
]
```

## Troubleshooting

### Translation Not Working

1. **Check if backend is running**: Make sure `uvicorn backend.main:app` is running
2. **Verify language models**: Run `python install_languages.py` again
3. **Check browser console**: Open DevTools (F12) and look for error messages
4. **Test API directly**: Visit `http://localhost:8000/docs` and test the `/translate` endpoint

### Language Models Not Installing

1. **Check internet connection**: Language models are downloaded from the internet
2. **Check disk space**: Models require several hundred MB of space
3. **Try manual installation**:
```bash
python -c "import argostranslate.package; argostranslate.package.update_package_index()"
```

### Slow Translation

1. **First translation is slower**: Initial model loading takes time
2. **Use backend translation**: Direct backend translation is faster than LibreTranslate server
3. **Reduce text length**: Translate shorter segments for faster results

### Port Already in Use

If port 5000 or 8000 is already in use:

**For LibreTranslate** (if using Option B):
- Edit `start_libretranslate.py` and change the port number
- Update `backend/.env` with the new `LIBRETRANSLATE_URL`

**For FastAPI**:
```bash
uvicorn backend.main:app --reload --port 8080
```

## Architecture

```
Frontend (JavaScript)
    ↓
    ↓ /translate, /detect
    ↓
Backend FastAPI (Python)
    ↓
    ↓ Uses translator.py
    ↓
Translation Layer
    ├─→ Local Argos Translate (primary)
    ├─→ LibreTranslate Server (fallback)
    └─→ MyMemory API (fallback)
```

## Configuration

Edit `backend/.env` to configure translation services:

```env
# Optional: Custom LibreTranslate server URL
LIBRETRANSLATE_URL=http://127.0.0.1:5000/translate

# Optional: LibreTranslate API key (for hosted services)
LIBRETRANSLATE_API_KEY=your_api_key_here
```

## Performance Tips

1. **Keep backend running**: Avoid restarting to keep models in memory
2. **Use caching**: Consider implementing translation caching for common phrases
3. **Batch translations**: Translate multiple items together when possible
4. **Optimize models**: Only install language pairs you need

## Additional Resources

- [LibreTranslate Documentation](https://github.com/LibreTranslate/LibreTranslate)
- [Argos Translate Documentation](https://github.com/argosopentech/argos-translate)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Support

If you encounter issues:
1. Check the console logs in your browser (F12)
2. Check the backend server logs
3. Verify all dependencies are installed: `pip list | grep -E "libretranslate|argostranslate"`
4. Try reinstalling: `pip install --upgrade libretranslate argostranslate`
