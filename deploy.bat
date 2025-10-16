@echo off
REM ==============================================
REM Greenesia Deployment Script for Hostinger (Windows)
REM ==============================================
REM This script helps automate the deployment process
REM ==============================================

echo ============================================
echo   Greenesia Deployment Script
echo ============================================
echo.

REM 1. Update composer dependencies (production only)
echo [1/8] Installing Composer dependencies (production)...
call composer install --no-dev --optimize-autoloader --no-interaction
if %errorlevel% neq 0 (
    echo ERROR: Composer install failed
    pause
    exit /b %errorlevel%
)
echo DONE: Composer dependencies installed
echo.

REM 2. Clear caches
echo [2/8] Clearing caches...
call php artisan config:clear
call php artisan cache:clear
call php artisan route:clear
call php artisan view:clear
echo DONE: Caches cleared
echo.

REM 3. Cache configurations
echo [3/8] Caching configurations...
call php artisan config:cache
call php artisan route:cache
call php artisan view:cache
echo DONE: Configurations cached
echo.

REM 4. Run migrations (optional)
set /p MIGRATE="[4/8] Run migrations? (y/n): "
if /i "%MIGRATE%"=="y" (
    call php artisan migrate --force
    echo DONE: Migrations completed
) else (
    echo SKIPPED: Migrations
)
echo.

REM 5. Link storage
echo [5/8] Linking storage...
call php artisan storage:link
echo DONE: Storage linked
echo.

REM 6. Build frontend assets (optional)
set /p BUILD="[6/8] Build frontend assets? (y/n): "
if /i "%BUILD%"=="y" (
    echo Installing npm dependencies...
    call npm install
    echo Building assets...
    call npm run build
    echo DONE: Assets built
) else (
    echo SKIPPED: Asset build
)
echo.

REM 7. Final optimization
echo [7/8] Running final optimization...
call php artisan optimize
echo DONE: Optimization complete
echo.

REM 8. Summary
echo [8/8] Deployment Summary
echo ============================================
echo Deployment completed successfully!
echo.
echo REMEMBER TO:
echo   - Update .env file with production credentials
echo   - Generate APP_KEY: php artisan key:generate
echo   - Check file permissions on server
echo   - Enable HTTPS in public/.htaccess
echo ============================================
echo.
pause
