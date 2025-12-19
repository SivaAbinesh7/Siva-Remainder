@echo off
echo ========================================
echo   AI Assistant Setup - FREE VERSION
echo ========================================
echo.
echo This will help you set up your FREE Groq AI assistant!
echo.
echo Step 1: Get your FREE API key
echo ----------------------------------------
echo 1. Open https://console.groq.com/keys
echo 2. Sign up (no credit card required!)
echo 3. Create an API key
echo 4. Copy the key (starts with gsk_...)
echo.
pause
echo.
echo Step 2: Enter your API key
echo ----------------------------------------
set /p GROQ_KEY="Paste your Groq API key here: "
echo.
echo Creating .env file...
(
echo # AI Assistant Configuration - FREE VERSION
echo # Generated automatically
echo.
echo VITE_GROQ_API_KEY=%GROQ_KEY%
echo.
echo # Optional: Choose model ^(default: llama-3.3-70b-versatile^)
echo # VITE_AI_MODEL=llama-3.3-70b-versatile
) > .env
echo.
echo ✓ .env file created successfully!
echo.
echo Step 3: Restart your server
echo ----------------------------------------
echo 1. Stop the current server (Ctrl+C)
echo 2. Run: npm start
echo 3. Open http://localhost:8080
echo 4. Try asking SJ anything!
echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
pause
