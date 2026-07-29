@echo off
title Mount2ocean GitHub Auto Sync Engine
echo ========================================================
echo   MOUNT2OCEAN TRAVEL & TOURS - AUTOMATED GITHUB SYNC
echo ========================================================
echo.

cd /d "%~dp0"

echo [1/3] Staging updated website files...
git add .

echo [2/3] Creating commit with live timestamp...
for /f "tokens=2 delims==" %%i in ('wmic os get localdatetime /value') do set datetime=%%i
set timestamp=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2% %datetime:~8,2%:%datetime:~10,2%
git commit -m "Auto Update Website Files: %timestamp%"

echo [3/3] Pushing changes to GitHub repository (mount2ocean)...
git push origin main

echo.
echo ========================================================
echo   🎉 SUCCESS! All website updates pushed to GitHub!
echo ========================================================
echo.
pause
