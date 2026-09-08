import re
import unicodedata

def generate_slug(text):
    """
    Generate URL-friendly slug from text.
    Converts text to lowercase, removes special characters,
    replaces spaces with hyphens, and handles Indonesian characters.
    """
    if not text:
        return ""
    
    # Convert to lowercase
    text = text.lower()
    
    # Normalize unicode characters (handles Indonesian characters)
    text = unicodedata.normalize('NFKD', text)
    
    # Remove non-ASCII characters and convert to ASCII
    text = text.encode('ascii', 'ignore').decode('ascii')
    
    # Replace spaces and multiple hyphens with single hyphen
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text)
    
    # Remove leading/trailing hyphens
    text = text.strip('-')
    
    return text

def generate_unique_slug(text, existing_slugs=None):
    """
    Generate unique slug by appending number if slug already exists.
    """
    if existing_slugs is None:
        existing_slugs = []
    
    base_slug = generate_slug(text)
    slug = base_slug
    counter = 1
    
    while slug in existing_slugs:
        slug = f"{base_slug}-{counter}"
        counter += 1
    
    return slug
