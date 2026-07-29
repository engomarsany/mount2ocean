@echo off
title GitHub Auto Sync - Mount2Ocean Portal
echo ====================================================
echo  Mount2Ocean Portal - GitHub Push Script
echo ====================================================
echo.
cd /d "%~dp0"
"C:\Program Files\Git\cmd\git.exe" remote set-url origin https://github.com/engomarsany/mount2ocean.git
"C:\Program Files\Git\cmd\git.exe" branch -M main
"C:\Program Files\Git\cmd\git.exe" push -u origin main
echo.
echo ====================================================
echo  ✓ Success! Project pushed to https://github.com/engomarsany/mount2ocean
echo ====================================================
pause
