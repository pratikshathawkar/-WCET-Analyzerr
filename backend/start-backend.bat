
@echo off
cd /d "%~dp0"

echo.
echo Starting WCET Backend...
echo.

if not exist "mysql-connector-j-26.7.0.jar" (
    echo ERROR: MySQL JDBC driver JAR not found.
    pause
    exit /b 1
)

if not exist "out\api\WCETServer.class" (
    echo ERROR: Compiled Java classes not found in out folder.
    pause
    exit /b 1
)

java -cp "out;mysql-connector-j-26.7.0.jar" api.WCETServer

pause
