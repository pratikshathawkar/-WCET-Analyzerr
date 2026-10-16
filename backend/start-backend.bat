bat
@echo off
cd /d "%~dp0"

echo ========================================
echo       WCET ANALYZER BACKEND
echo ========================================
echo.

if not exist "out" mkdir out

if not exist "mysql-connector-j-26.7.0.jar" (
    echo ERROR: MySQL Connector JAR not found!
    echo Place the JAR inside the backend folder.
    pause
    exit /b 1
)

echo Compiling WCET Backend...
echo.

javac -cp "mysql-connector-j-26.7.0.jar" -d out src\analysis\*.java src\cfg\*.java src\auth\*.java src\db\*.java src\api\WCETServer.java

if errorlevel 1 (
    echo.
    echo Backend compilation failed.
    pause
    exit /b 1
)

echo.
echo Starting WCET Backend...
echo.

java -cp "out;mysql-connector-j-26.7.0.jar" api.WCETServer

pause
