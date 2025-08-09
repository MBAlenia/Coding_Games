@echo off
echo 🚀 Starting Coding Platform...
echo.

REM Stop any existing containers
echo 📦 Stopping existing containers...
docker-compose down

REM Start all services
echo 🏗️  Building and starting services...
docker-compose up --build -d

REM Wait a bit for services to start
echo ⏳ Waiting for services to start...
timeout /t 10 /nobreak > nul

REM Show status
echo 📊 Service status:
docker-compose ps

echo.
echo ✅ Platform started successfully!
echo.
echo 🌐 Access URLs:
echo    Frontend: http://localhost:8080
echo    Backend API: http://localhost:8081/api/health
echo    MySQL: localhost:3306
echo    Redis: localhost:6379
echo.
echo 📋 Demo accounts:
echo    Admin: admin@test.com / password123
echo    Recruiter: recruiter@test.com / password123
echo    Candidate: candidate@test.com / password123
echo.
echo Press any key to exit...
pause > nul
