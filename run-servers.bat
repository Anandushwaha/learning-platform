@echo off
ECHO Starting Online Learning Platform...
ECHO.

ECHO Starting Backend Server...
start cmd /k "cd online-learning-platform\backend && npm run dev"

ECHO Starting Frontend Server...
start cmd /k "cd online-learning-platform\frontend && npm run dev"

ECHO Servers started successfully!
ECHO Backend: http://localhost:5000
ECHO Frontend: http://localhost:3000

ECHO.
ECHO Press any key to close this window...
pause > nul 