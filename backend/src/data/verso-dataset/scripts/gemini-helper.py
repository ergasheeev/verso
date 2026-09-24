#!/usr/bin/env python3
"""
Gemini API helper for Verso Dataset
Verso dataset loyihasi uchun Gemini API yordamchisi
"""

from google import genai
import json
import os
import sys

API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL = "gemini-2.5-flash"

if not API_KEY:
    sys.exit("GEMINI_API_KEY environment variable is not set.")

client = genai.Client(api_key=API_KEY)

def generate_country_content(country_name: str, language: str = "en") -> dict:
    """
    Mamlakat uchun kontent yaratish
    language: en, uz, ru, zh, de, fr
    """
    prompt = f"""
    Generate travel content for {country_name} in {language}.
    
    Follow these rules from RULES.md:
    - Tone: Clear, editorial, observational
    - summary: 400-600 characters
    - tagline: 30-60 characters, ends with period
    - bestSeason: Format "Month-Month (reason), Month-Month (reason)"
    - visaNote: Specify passport type, format "Passport: visa type, duration"
    - visaCheckedOn: "2026-09"
    - priceUSD: number (not string)
    
    Return ONLY JSON with these fields: summary, tagline, bestSeason, visaNote, visaCheckedOn, priceUSD
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    # Debug: print raw response
    print(f"Raw response: {response.text}")
    
    # Try to extract JSON from response
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        # If response is not pure JSON, try to extract JSON from it
        import re
        json_match = re.search(r'\{.*\}', response.text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            # Return as dict with raw text
            return {"raw_response": response.text}

def translate_text(text: str, target_lang: str) -> str:
    """Matnni tarjima qilish"""
    lang_names = {
        "uz": "Uzbek",
        "ru": "Russian", 
        "zh": "Chinese",
        "de": "German",
        "fr": "French"
    }
    
    prompt = f"Translate this text to {lang_names.get(target_lang, target_lang)}: {text}"
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    return response.text

def generate_places(country_name: str, count: int = 5) -> list:
    """
    Mamlakat uchun joylar ro'yxati yaratish
    5 ta minimum: 1 mashhur, 2 ikkinchi qator, 1 tabiat, 1 mahalliy hayot
    """
    prompt = f"""
    Generate {count} places to visit in {country_name}.
    
    Follow these rules:
    - 1 famous place everyone knows
    - 2 second-tier places for those who've seen the first
    - 1 nature place (not just buildings)
    - 1 local life place (market, bath, evening street)
    
    For each place provide: id (lowercase, hyphens), name, description (100-200 chars), priceUSD (number), hours
    
    Return ONLY JSON array of places.
    """
    
    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )
    
    # Try to extract JSON from response
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        # If response is not pure JSON, try to extract JSON from it
        import re
        json_match = re.search(r'\[.*\]', response.text, re.DOTALL)
        if json_match:
            return json.loads(json_match.group())
        else:
            # Return as dict with raw text
            return [{"raw_response": response.text}]

if __name__ == "__main__":
    import sys
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "country":
            country_name = sys.argv[2] if len(sys.argv) > 2 else "Uzbekistan"
            lang = sys.argv[3] if len(sys.argv) > 3 else "en"
            content = generate_country_content(country_name, lang)
            print(json.dumps(content, indent=2, ensure_ascii=False))
            
        elif command == "places":
            country_name = sys.argv[2] if len(sys.argv) > 2 else "Uzbekistan"
            count = int(sys.argv[3]) if len(sys.argv) > 3 else 5
            places = generate_places(country_name, count)
            print(json.dumps(places, indent=2, ensure_ascii=False))
            
        elif command == "translate":
            text = sys.argv[2]
            target_lang = sys.argv[3]
            result = translate_text(text, target_lang)
            print(result)
    else:
        # Test
        print("Testing Gemini API for Verso Dataset...")
        
        # Test country content generation
        print("\n--- Generating content for Uzbekistan ---")
        content = generate_country_content("Uzbekistan", "en")
        print(json.dumps(content, indent=2, ensure_ascii=False))
        
        # Test places generation
        print("\n--- Generating places for Uzbekistan ---")
        places = generate_places("Uzbekistan", 5)
        print(json.dumps(places, indent=2, ensure_ascii=False))
