"""
Script to install Argos Translate language models for LibreTranslate.
This will download and install the necessary language packages.
"""
import argostranslate.package
import argostranslate.translate


def find_package(from_code, to_code, available_packages):
    """Return an Argos package that matches a language pair."""
    for package in available_packages:
        if package.from_code == from_code and package.to_code == to_code:
            return package

    from_lower = from_code.lower()
    to_lower = to_code.lower()
    for package in available_packages:
        if from_lower in package.from_name.lower() and to_lower in package.to_name.lower():
            return package

    return None


def install_language_packages():
    """Install language packages for translation."""
    print("Updating Argos Translate package index...")
    argostranslate.package.update_package_index()

    available_packages = argostranslate.package.get_available_packages()

    # Prioritized for Rwanda tourists: Kinyarwanda (rw) ↔ common languages first,
    # then additional tourist pairs. Bi-directional where possible.
    desired_languages = [
        # Kinyarwanda ↔ Key tourist languages
        ('rw', 'en', 'Kinyarwanda -> English'),
        ('en', 'rw', 'English -> Kinyarwanda'),
        ('rw', 'fr', 'Kinyarwanda -> French'),
        ('fr', 'rw', 'French -> Kinyarwanda'),
        ('rw', 'es', 'Kinyarwanda -> Spanish'),
        ('es', 'rw', 'Spanish -> Kinyarwanda'),
        ('rw', 'de', 'Kinyarwanda -> German'),
        ('de', 'rw', 'German -> Kinyarwanda'),
        ('rw', 'it', 'Kinyarwanda -> Italian'),
        ('it', 'rw', 'Italian -> Kinyarwanda'),
        ('rw', 'pt', 'Kinyarwanda -> Portuguese'),
        ('pt', 'rw', 'Portuguese -> Kinyarwanda'),
        ('rw', 'ar', 'Kinyarwanda -> Arabic'),
        ('ar', 'rw', 'Arabic -> Kinyarwanda'),
        ('rw', 'ru', 'Kinyarwanda -> Russian'),
        ('ru', 'rw', 'Russian -> Kinyarwanda'),
        ('rw', 'zh', 'Kinyarwanda -> Chinese'),
        ('zh', 'rw', 'Chinese -> Kinyarwanda'),
        ('rw', 'ja', 'Kinyarwanda -> Japanese'),
        ('ja', 'rw', 'Japanese -> Kinyarwanda'),
        ('rw', 'sw', 'Kinyarwanda -> Swahili'),
        ('sw', 'rw', 'Swahili -> Kinyarwanda'),
        # Additional common pairs (en-centric for tourists)
        ('en', 'fr', 'English -> French'),
        ('fr', 'en', 'French -> English'),
        ('en', 'es', 'English -> Spanish'),
        ('es', 'en', 'Spanish -> English'),
        ('en', 'de', 'English -> German'),
        ('de', 'en', 'German -> English'),
    ]

    installed_count = 0
    missing_pairs = []

    for from_code, to_code, lang_name in desired_languages:
        package_to_install = find_package(from_code, to_code, available_packages)

        if package_to_install:
            print(f"Installing {lang_name}...")
            try:
                file_path = package_to_install.download()
                argostranslate.package.install_from_path(file_path)
                installed_count += 1
                print(f"[OK] Successfully installed {lang_name}")
            except Exception as e:
                error_message = str(e)
                print(f"[FAIL] Failed to install {lang_name}: {error_message}")
                missing_pairs.append((lang_name, error_message))
        else:
            missing_reason = "Package not found in Argos Translate index"
            print(f"[FAIL] Package not found for {lang_name}")
            missing_pairs.append((lang_name, missing_reason))

    print(f"\n{'='*50}")
    print(f"Installation complete! Installed {installed_count} language packages.")
    print(f"{'='*50}")

    if missing_pairs:
        print("\nMissing or unavailable packages:")
        for lang_name, reason in missing_pairs:
            print(f"  - {lang_name}: {reason}")

        print(
            "\nNote: Kinyarwanda translation packages are not always available in the "
            "Argos Translate package index. If a specific pair is missing, you may "
            "need to add a compatible Kinyarwanda model manually or use a custom "
            "LibreTranslate model file."
        )

    installed_packages = argostranslate.package.get_installed_packages()
    print(f"\nTotal installed packages: {len(installed_packages)}")
    if installed_packages:
        print("\nInstalled language pairs:")
        for pkg in installed_packages:
            print(f"  - {pkg.from_name} -> {pkg.to_name}")


if __name__ == "__main__":
    install_language_packages()
