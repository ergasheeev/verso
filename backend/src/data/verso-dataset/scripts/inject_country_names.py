import os
import re

BASE_DIR = r"D:\LoneFoundry-projects\verso-dataset"

country_names = {
    'AE': {'en': 'United Arab Emirates', 'uz': 'Birlashgan Arab Amirliklari', 'ru': 'Объединенные Арабские Эмираты', 'zh': '阿拉伯联合酋长国', 'de': 'Vereinigte Arabische Emirate', 'fr': 'Émirats arabes unis'},
    'AM': {'en': 'Armenia', 'uz': 'Armaniston', 'ru': 'Армения', 'zh': '亚美尼亚', 'de': 'Armenien', 'fr': 'Arménie'},
    'AR': {'en': 'Argentina', 'uz': 'Argentina', 'ru': 'Аргентина', 'zh': '阿根廷', 'de': 'Argentinien', 'fr': 'Argentine'},
    'AT': {'en': 'Austria', 'uz': 'Avstriya', 'ru': 'Австрия', 'zh': '奥地利', 'de': 'Österreich', 'fr': 'Autriche'},
    'AU': {'en': 'Australia', 'uz': 'Avstraliya', 'ru': 'Австралия', 'zh': '澳大利亚', 'de': 'Australien', 'fr': 'Australie'},
    'AZ': {'en': 'Azerbaijan', 'uz': 'Ozarbayjon', 'ru': 'Азербайджан', 'zh': '阿塞拜疆', 'de': 'Aserbaidschan', 'fr': 'Azerbaïdjan'},
    'BR': {'en': 'Brazil', 'uz': 'Braziliya', 'ru': 'Бразилия', 'zh': '巴西', 'de': 'Brasilien', 'fr': 'Brésil'},
    'CH': {'en': 'Switzerland', 'uz': 'Shveytsariya', 'ru': 'Швейцария', 'zh': '瑞士', 'de': 'Schweiz', 'fr': 'Suisse'},
    'CN': {'en': 'China', 'uz': 'Xitoy', 'ru': 'Китай', 'zh': '中国', 'de': 'China', 'fr': 'Chine'},
    'CO': {'en': 'Colombia', 'uz': 'Kolumbiya', 'ru': 'Колумбия', 'zh': '哥伦比亚', 'de': 'Kolumbien', 'fr': 'Colombie'},
    'CZ': {'en': 'Czech Republic', 'uz': 'Chexiya', 'ru': 'Чехия', 'zh': '捷克', 'de': 'Tschechien', 'fr': 'République tchèque'},
    'DE': {'en': 'Germany', 'uz': 'Germaniya', 'ru': 'Германия', 'zh': '德国', 'de': 'Deutschland', 'fr': 'Allemagne'},
    'EG': {'en': 'Egypt', 'uz': 'Misr', 'ru': 'Египет', 'zh': '埃及', 'de': 'Ägypten', 'fr': 'Égypte'},
    'ES': {'en': 'Spain', 'uz': 'Ispaniya', 'ru': 'Испания', 'zh': '西班牙', 'de': 'Spanien', 'fr': 'Espagne'},
    'FR': {'en': 'France', 'uz': 'Fransiya', 'ru': 'Франция', 'zh': '法国', 'de': 'Frankreich', 'fr': 'France'},
    'GB': {'en': 'United Kingdom', 'uz': 'Buyuk Britaniya', 'ru': 'Великобритания', 'zh': '英国', 'de': 'Vereinigtes Königreich', 'fr': 'Royaume-Uni'},
    'GE': {'en': 'Georgia', 'uz': 'Gruziya', 'ru': 'Грузия', 'zh': '格鲁吉亚', 'de': 'Georgien', 'fr': 'Géorgie'},
    'GR': {'en': 'Greece', 'uz': 'Gretsiya', 'ru': 'Греция', 'zh': '希腊', 'de': 'Griechenland', 'fr': 'Grèce'},
    'HR': {'en': 'Croatia', 'uz': 'Xorvatiya', 'ru': 'Хорватия', 'zh': '克罗地亚', 'de': 'Kroatien', 'fr': 'Croatie'},
    'HU': {'en': 'Hungary', 'uz': 'Vengriya', 'ru': 'Венгрия', 'zh': '匈牙利', 'de': 'Ungarn', 'fr': 'Hongrie'},
    'ID': {'en': 'Indonesia', 'uz': 'Indoneziya', 'ru': 'Индонезия', 'zh': '印度尼西亚', 'de': 'Indonesien', 'fr': 'Indonésie'},
    'IN': {'en': 'India', 'uz': 'Hindiston', 'ru': 'Индия', 'zh': '印度', 'de': 'Indien', 'fr': 'Inde'},
    'IS': {'en': 'Iceland', 'uz': 'Islandiya', 'ru': 'Исландия', 'zh': '冰岛', 'de': 'Island', 'fr': 'Islande'},
    'IT': {'en': 'Italy', 'uz': 'Italiya', 'ru': 'Италия', 'zh': '意大利', 'de': 'Italien', 'fr': 'Italie'},
    'JP': {'en': 'Japan', 'uz': 'Yaponiya', 'ru': 'Япония', 'zh': '日本', 'de': 'Japan', 'fr': 'Japon'},
    'KE': {'en': 'Kenya', 'uz': 'Keniya', 'ru': 'Кения', 'zh': '肯尼亚', 'de': 'Kenia', 'fr': 'Kenya'},
    'KG': {'en': 'Kyrgyzstan', 'uz': "Qirg'iziston", 'ru': 'Кыргызстан', 'zh': '吉尔吉斯斯坦', 'de': 'Kirgisistan', 'fr': 'Kirghizistan'},
    'KZ': {'en': 'Kazakhstan', 'uz': "Qozog'iston", 'ru': 'Казахстан', 'zh': '哈萨克斯坦', 'de': 'Kasachstan', 'fr': 'Kazakhstan'},
    'MA': {'en': 'Morocco', 'uz': 'Marokash', 'ru': 'Марокко', 'zh': '摩洛哥', 'de': 'Marokko', 'fr': 'Maroc'},
    'MX': {'en': 'Mexico', 'uz': 'Meksika', 'ru': 'Мексика', 'zh': '墨西哥', 'de': 'Mexiko', 'fr': 'Mexique'},
    'MY': {'en': 'Malaysia', 'uz': 'Malayziya', 'ru': 'Малайзия', 'zh': '马来西亚', 'de': 'Malaysia', 'fr': 'Malaisie'},
    'NL': {'en': 'Netherlands', 'uz': 'Niderlandiya', 'ru': 'Нидерланды', 'zh': '荷兰', 'de': 'Niederlande', 'fr': 'Pays-Bas'},
    'NO': {'en': 'Norway', 'uz': 'Norvegiya', 'ru': 'Норвегия', 'zh': '挪威', 'de': 'Norwegen', 'fr': 'Norvège'},
    'NZ': {'en': 'New Zealand', 'uz': 'Yangi Zelandiya', 'ru': 'Новая Зеландия', 'zh': '新西兰', 'de': 'Neuseeland', 'fr': 'Nouvelle-Zélande'},
    'PE': {'en': 'Peru', 'uz': 'Peru', 'ru': 'Перу', 'zh': '秘鲁', 'de': 'Peru', 'fr': 'Pérou'},
    'PL': {'en': 'Poland', 'uz': 'Polsha', 'ru': 'Польша', 'zh': '波兰', 'de': 'Polen', 'fr': 'Pologne'},
    'PT': {'en': 'Portugal', 'uz': 'Portugaliya', 'ru': 'Португалия', 'zh': '葡萄牙', 'de': 'Portugal', 'fr': 'Portugal'},
    'SE': {'en': 'Sweden', 'uz': 'Shvetsiya', 'ru': 'Швеция', 'zh': '瑞典', 'de': 'Schweden', 'fr': 'Suède'},
    'SG': {'en': 'Singapore', 'uz': 'Singapur', 'ru': 'Сингапур', 'zh': '新加坡', 'de': 'Singapur', 'fr': 'Singapour'},
    'TH': {'en': 'Thailand', 'uz': 'Tailand', 'ru': 'Таиланд', 'zh': '泰国', 'de': 'Thailand', 'fr': 'Thaïlande'},
    'TR': {'en': 'Turkey', 'uz': 'Turkiya', 'ru': 'Турция', 'zh': '土耳其', 'de': 'Türkei', 'fr': 'Turquie'},
    'US': {'en': 'United States', 'uz': 'AQSh', 'ru': 'США', 'zh': '美国', 'de': 'Vereinigte Staaten', 'fr': 'États-Unis'},
    'UZ': {'en': 'Uzbekistan', 'uz': "O'zbekiston", 'ru': 'Узбекистан', 'zh': '乌兹别克斯坦', 'de': 'Usbekistan', 'fr': 'Ouzbékistan'},
    'VN': {'en': 'Vietnam', 'uz': 'Vyetnam', 'ru': 'Вьетнам', 'zh': '越南', 'de': 'Vietnam', 'fr': 'Vietnam'},
    'ZA': {'en': 'South Africa', 'uz': 'Janubiy Afrika', 'ru': 'Южная Африка', 'zh': '南非', 'de': 'Südafrika', 'fr': 'Afrique du Sud'}
}

# 1. Update A_countries
a_dir = os.path.join(BASE_DIR, "A_countries")
for root, _, files in os.walk(a_dir):
    for fn in files:
        if fn.endswith('.ts') and not fn.startswith('_'):
            code = fn.replace('.ts', '').upper()
            if code in country_names:
                fp = os.path.join(root, fn)
                with open(fp, encoding='utf-8') as f:
                    content = f.read()
                
                # Check if name already in content
                if 'name:' not in content and '"name":' not in content:
                    # insert after code: "XX",
                    en_name = country_names[code]['en']
                    content = re.sub(
                        r'code:\s*["\']' + code + r'["\'],',
                        f'code: "{code}",\n  name: "{en_name}",',
                        content,
                        flags=re.IGNORECASE
                    )
                    with open(fp, 'w', encoding='utf-8') as f:
                        f.write(content)
                    print(f"Updated A_countries: {code} -> {en_name}")

# 2. Update D_translations
d_dir = os.path.join(BASE_DIR, "D_translations")
for lang in ['uz', 'ru', 'zh', 'de', 'fr']:
    lang_dir = os.path.join(d_dir, lang)
    for root, _, files in os.walk(lang_dir):
        for fn in files:
            if fn.endswith('.ts') and not fn.startswith('_'):
                code = fn.replace('.ts', '').upper()
                if code in country_names:
                    fp = os.path.join(root, fn)
                    with open(fp, encoding='utf-8') as f:
                        content = f.read()
                    
                    if 'name:' not in content and '"name":' not in content:
                        trans_name = country_names[code][lang]
                        # insert at beginning of exported object
                        content = re.sub(
                            r'(export\s+const\s+\w+\s*=\s*\{)',
                            f'\\1\n  name: "{trans_name}",',
                            content
                        )
                        with open(fp, 'w', encoding='utf-8') as f:
                            f.write(content)

print("Injected country names into all A_countries and D_translations successfully!")
