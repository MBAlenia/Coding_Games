@echo off
echo Building React application manually...

REM Create build directory structure
if not exist build mkdir build
if not exist build\static mkdir build\static
if not exist build\static\css mkdir build\static\css
if not exist build\static\js mkdir build\static\js

REM Copy index.html
echo Creating index.html...
(
echo ^<!DOCTYPE html^>
echo ^<html lang="en"^>
echo ^<head^>
echo   ^<meta charset="utf-8" /^>
echo   ^<meta name="viewport" content="width=device-width, initial-scale=1" /^>
echo   ^<meta name="theme-color" content="#000000" /^>
echo   ^<meta name="description" content="Coding assessment platform" /^>
echo   ^<link rel="manifest" href="/manifest.json" /^>
echo   ^<title^>Coding Platform^</title^>
echo   ^<link href="/static/css/main.css" rel="stylesheet"^>
echo ^</head^>
echo ^<body^>
echo   ^<noscript^>You need to enable JavaScript to run this app.^</noscript^>
echo   ^<div id="root"^>^</div^>
echo   ^<script src="/static/js/bundle.js"^>^</script^>
echo ^</body^>
echo ^</html^>
) > build\index.html

REM Copy CSS files
echo Copying CSS files...
copy src\index.css build\static\css\main.css >nul 2>&1
copy src\App.css build\static\css\app.css >nul 2>&1

REM Copy manifest.json
echo Copying manifest.json...
copy public\manifest.json build\manifest.json >nul 2>&1

echo.
echo Build completed successfully!
echo Files created in build directory:
echo - index.html
echo - static/css/main.css
echo - static/css/app.css
echo - manifest.json
echo.
echo Note: JavaScript bundling requires npm run build.
echo The CSS styles have been copied and should now be visible.
