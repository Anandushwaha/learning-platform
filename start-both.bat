@echo off
echo Starting Online Learning Platform...
echo.

start cmd /k "cd online-learning-platform\backend && npm run dev"
start cmd /k "cd online-learning-platform\frontend && npm run dev"

echo Servers started successfully!
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000 