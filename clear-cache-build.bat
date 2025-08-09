@echo off
echo ========================================
echo  CLEARING CACHE AND REBUILDING FRONTEND
echo ========================================

echo.
echo [1/5] Stopping containers...
docker-compose down

echo.
echo [2/5] Removing Docker build cache...
docker builder prune -f

echo.
echo [3/5] Removing frontend image to force rebuild...
docker rmi coding-platform-frontend 2>nul || echo Frontend image not found, continuing...

echo.
echo [4/5] Clearing npm cache in container...
docker run --rm -v %cd%/frontend:/app -w /app node:18-alpine npm cache clean --force

echo.
echo [5/5] Rebuilding and starting containers...
docker-compose up -d --build --force-recreate

echo.
echo ========================================
echo  CACHE CLEARED AND REBUILD COMPLETE!
echo ========================================
echo.
echo Frontend should be available at: http://localhost:8080
echo Backend should be available at: http://localhost:8081
echo.
pause
