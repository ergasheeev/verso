@echo off
chcp 65001 > nul
echo.
echo ==========================================
echo   VERSO DATASET — BUILD va VALIDATSIYA
echo ==========================================
echo.

echo [1/5] Validatsiya...
call npx ts-node scripts/validate.ts
if %errorlevel% neq 0 (
    echo.
    echo XATO: Validatsiya muvaffaqiyatsiz. Xatolarni tuzating.
    pause
    exit /b 1
)

echo [2/5] Mamlakat matnlari build...
call npx ts-node scripts/build-countries.ts

echo [3/5] Joylar build...
call npx ts-node scripts/build-places.ts

echo [4/5] AI Knowledge base build...
call npx ts-node scripts/build-knowledge-base.ts

echo [5/5] Tarjimalar build...
call npx ts-node scripts/build-i18n.ts

echo.
echo ==========================================
echo   ✅ TAYYOR! output\ papkasini koring.
echo ==========================================
echo.
echo Keyingi qadam: output\ fayllarini verso loyihasiga ko'chiring.
echo   output\countries.ts       → verso\frontend\src\data\countries.ts
echo   output\index.ts           → verso\frontend\src\data\index.ts
echo   output\countries.i18n.ts  → verso\frontend\src\data\countries.i18n.ts
echo   output\knowledge-base.ts  → verso\backend\src\data\knowledge-base.ts
echo.
pause
