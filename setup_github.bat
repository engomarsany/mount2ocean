@echo off
title Mount2ocean GitHub Repository Initial Setup
echo ========================================================
echo   MOUNT2OCEAN TRAVEL & TOURS - GITHUB SETUP WIZARD
echo ========================================================
echo.

cd /d "%~dp0"

echo Step 1: Please enter your GitHub Username (e.g. your_github_username):
set /p github_user="Enter GitHub Username: "

if "%github_user%"=="" (
    echo Username cannot be empty! Please re-run setup_github.bat
    pause
    exit /b
)

echo.
echo Step 2: Initializing local Git repository...
git init
git branch -M main

echo.
echo Step 3: Linking Remote GitHub Repository (mount2ocean)...
git remote remove origin 2>nul
git remote add origin https://github.com/%github_user%/mount2ocean.git

echo.
echo Step 4: Staging all website files...
git add .
git commit -m "Initial Commit: Mount2ocean Travel & Tours Complete Web App"

echo.
echo Step 5: Pushing code to GitHub...
echo (If prompted, log in with your GitHub Personal Access Token or browser auth)
git push -u origin main

echo.
echo ========================================================
echo   🎉 SUCCESS! Repository created & connected!
echo   GitHub URL: https://github.com/%github_user%/mount2ocean
echo ========================================================
echo.
pause
