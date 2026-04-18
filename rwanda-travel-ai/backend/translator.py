import os
from pathlib import Path

import requests
from dotenv import load_dotenv

try:
    import argostranslate.package
    import argostranslate.translate
    ARGOS_AVAILABLE = True
except Exception:
    ARGOS_AVAILABLE = False

try:
    from langdetect import detect as langdetect_detect
    LANGDETECT_AVAILABLE = True
except Exception:
    LANGDETECT_AVAILABLE = False

ENV_PATH = Path(__file__).with_name(".env")
load_dotenv(ENV_PATH)

LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "").strip()
LIBRETRANSLATE_API_KEY = os.getenv("LIBRETRANSLATE_API_KEY", "").strip()
LIBRE_DETECT_URL = os.getenv("LIBRETRANSLATE_DETECT_URL", "").strip()
MYMEMORY_URL = "https://api.mymemory.translated.net/get"

DEFAULT_LIBRE_URLS = [
    LIBRETRANSLATE_URL,
]
if LIBRETRANSLATE_API_KEY:
    DEFAULT_LIBRE_URLS.extend([
        "https://libretranslate.com/translate",
        "https://translate.argosopentech.com/translate",
    ])

SWAHILI_HINTS = {
    "safari",
    "njema",
    "habari",
    "asante",
    "rafiki",
    "karibu",
    "nzuri",
    "sawa",
    "pole",
    "mambo",
}
KW_HINTS = {
    "amakuru",
    "muraho",
    "urakoze",
    "ndetse",
    "muri",
    "ikaze",
}

SUPPORTED_LANG_CODES = {
    "en",
    "fr",
    "rw",
    "sw",
    "es",
    "de",
    "it",
    "pt",
    "ar",
    "ru",
    "zh",
    "ja",
}


def _normalize_lang(code: str) -> str:
    return (code or "").strip().lower()


def _detect_by_hint(text: str) -> str | None:
    normalized = text.lower()
    if any(word in normalized for word in SWAHILI_HINTS):
        return "sw"
    if any(word in normalized for word in KW_HINTS):
        return "rw"
    return None


def _detect_with_langdetect(text: str) -> str | None:
    if not LANGDETECT_AVAILABLE:
        return None
    try:
        guessed = langdetect_detect(text)
        if guessed and guessed in SUPPORTED_LANG_CODES:
            return guessed
    except Exception:
        return None
    return None


def _get_detect_url() -> str | None:
    if LIBRE_DETECT_URL:
        return LIBRE_DETECT_URL
    if LIBRETRANSLATE_URL:
        if LIBRETRANSLATE_URL.rstrip("/").endswith("/translate"):
            return LIBRETRANSLATE_URL.rstrip("/")[:-len("/translate")] + "/detect"
        return LIBRETRANSLATE_URL.rstrip("/") + "/detect"
    if LIBRETRANSLATE_API_KEY:
        return "https://libretranslate.com/detect"
    return None


def _try_argos_translate(text: str, source_lang: str, target_lang: str) -> str | None:
    if not ARGOS_AVAILABLE:
        return None

    source = _normalize_lang(source_lang)
    target = _normalize_lang(target_lang)
    if source == "auto" or not source or not target:
        return None

    try:
        installed_languages = argostranslate.translate.get_installed_languages()
        from_lang = next((lang for lang in installed_languages if lang.code == source), None)
        to_lang = next((lang for lang in installed_languages if lang.code == target), None)
        if not from_lang or not to_lang:
            return None

        translation = from_lang.get_translation(to_lang)
        if not translation:
            return None

        translated = translation.translate(text).strip()
        return translated if translated else None
    except Exception:
        return None


def _try_libretranslate(text: str, source_lang: str, target_lang: str) -> str | None:
    source = "auto" if _normalize_lang(source_lang) == "auto" else _normalize_lang(source_lang)
    target = _normalize_lang(target_lang)
    for url in [u for u in DEFAULT_LIBRE_URLS if u]:
        try:
            payload = {
                "q": text,
                "source": source,
                "target": target,
                "format": "text",
            }
            if LIBRETRANSLATE_API_KEY:
                payload["api_key"] = LIBRETRANSLATE_API_KEY

            response = requests.post(url, json=payload, timeout=10)
            if response.status_code == 200:
                translated = response.json().get("translatedText", "").strip()
                if translated:
                    return translated
        except Exception:
            continue
    return None


def _try_mymemory(text: str, source_lang: str, target_lang: str) -> str | None:
    source = detect_language(text) if _normalize_lang(source_lang) == "auto" else _normalize_lang(source_lang)
    target = _normalize_lang(target_lang)
    if not source or not target:
        return None

    langpair = f"{source}|{target}"
    try:
        response = requests.get(
            MYMEMORY_URL,
            params={"q": text, "langpair": langpair},
            timeout=8,
        )
        if response.status_code == 200:
            payload = response.json()
            translated = payload.get("responseData", {}).get("translatedText", "").strip()
            if translated:
                return translated
    except Exception:
        return None
    return None


def _detect_with_hosted_service(text: str) -> str | None:
    detect_url = _get_detect_url()
    if not detect_url:
        return None

    payload = {"q": text}
    if LIBRETRANSLATE_API_KEY:
        payload["api_key"] = LIBRETRANSLATE_API_KEY

    try:
        response = requests.post(detect_url, json=payload, timeout=5)
        if response.status_code != 200:
            return None
        result = response.json()
        if isinstance(result, list) and len(result) > 0:
            return result[0].get("language", None)
    except Exception:
        return None
    return None


def detect_language(text: str) -> str:
    """Detect language using local/hosed services with fallback to langdetect and keyword hints."""
    if not text or not text.strip():
        return "en"

    hint_language = _detect_by_hint(text)
    if hint_language:
        return hint_language

    detected = _detect_with_hosted_service(text)
    if detected and detected != "en":
        return detected

    if LANGDETECT_AVAILABLE:
        guessed = _detect_with_langdetect(text)
        if guessed and guessed != "en":
            return guessed

    return detected or "en"


def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    source = "auto" if _normalize_lang(source_lang) == "auto" else _normalize_lang(source_lang)
    target = _normalize_lang(target_lang)

    if target not in SUPPORTED_LANG_CODES:
        raise RuntimeError(f"Unsupported target language: {target}")

    if source == "auto":
        source = detect_language(text)

    local_translation = _try_argos_translate(text, source, target)
    if local_translation:
        return local_translation

    online_translation = _try_libretranslate(text, source, target)
    if online_translation:
        return online_translation

    free_fallback_translation = _try_mymemory(text, source, target)
    if free_fallback_translation:
        return free_fallback_translation

    raise RuntimeError(
        "Translation failed. Ensure LibreTranslate/Argos Translate are installed and reachable, or verify the source/target language values."
    )
