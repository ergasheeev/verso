# Verso Dataset

**42 ta mamlakat bo'yicha Verso sayohat atlasining to'liq dataset loyihasi.**

Bu papka `verso` loyihasi uchun barcha mazmun ma'lumotlarini tayyorlaydi:
mamlakat matnlari, joylar, rasmlar va tarjimalar.

---

## Tuzilma

| Papka | Nima |
|-------|------|
| `A_countries/` | Mamlakat matnlari — inglizcha master |
| `B_places/` | Joylar (5–10 ta har mamlakatdan) |
| `C_images/` | Rasmlar + litsenziya jadvali |
| `D_translations/` | 4 til: ru, uz, zh, de, fr |
| `output/` | Tayyor TypeScript fayllar |
| `scripts/` | Build va validatsiya skriptlar |

## Ish Tartibi

```
A → B → C → D → validate → build → output → verso ga ko'chir
```

## Tezkor Boshlash

```bash
# Validatsiya
npx ts-node scripts/validate.ts

# Hammasini build qilish
scripts\run-all.bat
```

## Qoidalar

`RULES.md` ni o'qing — ohang, format, litsenziya hamma qoidalar o'sha yerda.

## Holat

`PROGRESS.md` da har mamlakat uchun A/B/C/D holati ko'rsatilgan.
