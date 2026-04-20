@echo off
TITLE SecureVote - Project Management Console
SETLOCAL EnableDelayedExpansion

:: --- ANSI COLOR SETUP ---
:: Robustly obtain the ESC character for colors
SET "ESC="
for /F "tokens=1,2 delims=#" %%a in ('"prompt #$H#$E# & echo on & for %%b in (1) do rem"') do (
    IF NOT "%%b"=="" SET "ESC=%%b"
)

:: Define colors with fallback (empty string if ESC failed)
IF NOT "!ESC!"=="" (
    SET "CYAN=!ESC![96m"
    SET "GREEN=!ESC![92m"
    SET "YELLOW=!ESC![93m"
    SET "RED=!ESC![91m"
    SET "RESET=!ESC![0m"
    SET "BOLD=!ESC![1m"
) ELSE (
    SET "CYAN=" & SET "GREEN=" & SET "YELLOW=" & SET "RED=" & SET "RESET=" & SET "BOLD="
)

:: --- CONFIGURATION ---
SET BACKEND_DIR=backend
SET FRONTEND_DIR=frontend

:MENU
cls
echo %CYAN%********************************************************************************%RESET%
echo %BOLD%           SECUREVOTE - SECURE ONLINE VOTING SYSTEM%RESET%
echo %CYAN%********************************************************************************%RESET%
echo.
echo %BOLD%[ PROJECT STATUS ]%RESET%
echo  Location: %~dp0
echo.
echo %BOLD%[ SELECT AN ACTION ]%RESET%
echo.
echo  %GREEN%1.%RESET% %BOLD%Run All Services (Docker - Recommended)%RESET%
echo     %YELLOW%^> Starts MySQL, Backend (8080), and Frontend (3001).%RESET%
echo.
echo  %GREEN%2.%RESET% %BOLD%Run Locally (Dev Mode)%RESET%
echo     %YELLOW%^> Runs Spring Boot and Next.js natively.%RESET%
echo     %YELLOW%^> Requires: Java 17, Maven, Node.js, MySQL.%RESET%
echo.
echo  %GREEN%3.%RESET% %BOLD%Build Project (Production)%RESET%
echo     %YELLOW%^> Maven build for backend, npm build for frontend.%RESET%
echo.
echo  %GREEN%4.%RESET% %BOLD%Maintenance [Docker]%RESET%
echo     %YELLOW%^> Stop Docker services ^& Prune unused containers.%RESET%
echo.
echo  %CYAN%5.%RESET% %BOLD%Merkle Audit %BOLD%[NEW]%RESET%%RESET%
echo     %YELLOW%^> Instructions for sealing elections cryptographically.%RESET%
echo.
echo  %RED%6. Exit%RESET%
echo.
echo %CYAN%--------------------------------------------------------------------------------%RESET%
SET "choice="
SET /P choice="%BOLD%Enter choice (1-6): %RESET%"

IF "!choice!"=="1" GOTO DOCKER_RUN
IF "!choice!"=="2" GOTO LOCAL_RUN
IF "!choice!"=="3" GOTO BUILD_PROJECT
IF "!choice!"=="4" GOTO MAINTENANCE
IF "!choice!"=="5" GOTO MERKLE_AUDIT
IF "!choice!"=="6" EXIT
echo %RED%Invalid choice. Please try again.%RESET%
pause
GOTO MENU

:DOCKER_RUN
echo.
echo %CYAN%[ INFO ]%RESET% Starting services with Docker Compose...
docker-compose up --build -d
IF %ERRORLEVEL% NEQ 0 (
    echo %RED%[ ERROR ]%RESET% Docker Compose failed to start.
    pause
    GOTO MENU
)
echo.
echo %GREEN%[ SUCCESS ]%RESET% Services are starting up!
echo  - %BOLD%Frontend:%RESET%   %BOLD%http://localhost:3001%RESET%
echo  - %BOLD%Merkle Audit:%RESET% %BOLD%http://localhost:3001/verify/merkle%RESET% %YELLOW%[NEW]%RESET%
echo  - %BOLD%Backend API:%RESET% %BOLD%http://localhost:8080%RESET%
echo.
pause
GOTO MENU

:LOCAL_RUN
echo.
echo %CYAN%[ INFO ]%RESET% Starting local development environment...

:: Check for MySQL (Simple check if port 3306 is listening)
netstat -ano | findstr :3306 >nul
IF ERRORLEVEL 1 (
    echo %YELLOW%[ WARNING ]%RESET% MySQL seems to be offline on port 3306.
    echo           Please ensure MySQL is running before proceeding.
)

:: Check for Maven
where mvn >nul 2>nul
IF ERRORLEVEL 1 (
    echo %RED%[ ERROR ]%RESET% Maven "mvn" was not found in your PATH.
    echo           If you just installed it, please restart this terminal.
    pause
    GOTO MENU
)

echo %CYAN%[ INFO ]%RESET% Launching Backend...
start "SecureVote Backend" cmd /c "cd %BACKEND_DIR% && echo Starting Spring Boot... && mvn spring-boot:run"

echo %CYAN%[ INFO ]%RESET% Launching Frontend...
start "SecureVote Frontend" cmd /c "cd %FRONTEND_DIR% && echo Starting Next.js... && npm run dev"

echo.
echo %GREEN%[ SUCCESS ]%RESET% Development windows opened.
echo.
pause
GOTO MENU

:BUILD_PROJECT
echo.
echo %CYAN%[ INFO ]%RESET% Building Backend (Maven)...
cd %BACKEND_DIR%
call mvn clean package -DskipTests
cd ..
echo.
echo %CYAN%[ INFO ]%RESET% Building Frontend (Next.js)...
cd %FRONTEND_DIR%
call npm install && call npm run build
cd ..
echo.
echo %GREEN%[ SUCCESS ]%RESET% Build complete.
echo.
pause
GOTO MENU

:MAINTENANCE
echo.
echo %CYAN%[ INFO ]%RESET% Stopping Docker services...
docker-compose down
echo.
echo %CYAN%[ INFO ]%RESET% Pruning unused containers and networks...
docker system prune -f
echo.
echo %GREEN%[ SUCCESS ]%RESET% Cleanup complete.
echo.
pause
GOTO MENU

:MERKLE_AUDIT
echo.
echo %CYAN%********************************************************************************%RESET%
echo %BOLD%           MERKLE ROOT TREE - CRYPTOGRAPHIC AUDITS%RESET%
echo %CYAN%********************************************************************************%RESET%
echo.
echo %BOLD%[ CRYPTOGRAPHIC SEALING ]%RESET%
echo  To seal an election and generate the Merkle Root, the Admin must 
echo  trigger the calculation via the API.
echo.
echo %YELLOW%Command Template:%RESET%
echo  curl -X POST http://localhost:8080/api/audit/calculate/{electionId}
echo  %BOLD%(Requires Admin JWT Authorization Header)%RESET%
echo.
echo %CYAN%--------------------------------------------------------------------------------%RESET%
echo %BOLD%[ VOTER VERIFICATION ]%RESET%
echo  Voters can verify their specific vote against the Election Root here:
echo  %BOLD%http://localhost:3001/verify/merkle%RESET%
echo.
echo %CYAN%--------------------------------------------------------------------------------%RESET%
echo %BOLD%[ TECHNICAL SPECS ]%RESET%
echo  - Algorithm: SHA-256 (Binary Merkle Tree)
echo  - Implementation: Sidecar Architecture (Non-invasive)
echo  - Verification: Multi-layer browser-side re-hashing
echo.
pause
GOTO MENU
