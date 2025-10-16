#!/bin/bash

echo "========================================="
echo "Laravel Error 500 Diagnosis Script"
echo "========================================="
echo ""

# Check Laravel log file
echo "1. Checking Laravel log file..."
if [ -f "storage/logs/laravel.log" ]; then
    echo "✓ Log file exists"
    echo "Last 50 lines of laravel.log:"
    tail -50 storage/logs/laravel.log
else
    echo "✗ Log file NOT found at storage/logs/laravel.log"
fi
echo ""

# Check storage permissions
echo "2. Checking storage directory permissions..."
ls -la storage/
ls -la storage/logs/
echo ""

# Check if storage directories are writable
echo "3. Testing write permissions..."
if [ -w "storage/logs" ]; then
    echo "✓ storage/logs is writable"
else
    echo "✗ storage/logs is NOT writable"
fi
echo ""

# Check .env file
echo "4. Checking .env configuration..."
if [ -f ".env" ]; then
    echo "✓ .env file exists"
    echo "APP_ENV: $(grep APP_ENV .env)"
    echo "APP_DEBUG: $(grep APP_DEBUG .env)"
    echo "LOG_CHANNEL: $(grep LOG_CHANNEL .env)"
    echo "LOG_LEVEL: $(grep LOG_LEVEL .env)"
else
    echo "✗ .env file NOT found"
fi
echo ""

# Check PHP error log
echo "5. Checking PHP error logs..."
if [ -f "/var/log/php_errors.log" ]; then
    echo "PHP error log (last 30 lines):"
    tail -30 /var/log/php_errors.log
elif [ -f "/var/log/php-fpm/error.log" ]; then
    echo "PHP-FPM error log (last 30 lines):"
    tail -30 /var/log/php-fpm/error.log
else
    echo "Looking for PHP error logs in common locations..."
    find /var/log -name "*php*" -type f 2>/dev/null
fi
echo ""

# Check Apache/Nginx error logs
echo "6. Checking web server error logs..."
if [ -f "/var/log/apache2/error.log" ]; then
    echo "Apache error log (last 30 lines):"
    tail -30 /var/log/apache2/error.log
elif [ -f "/var/log/nginx/error.log" ]; then
    echo "Nginx error log (last 30 lines):"
    tail -30 /var/log/nginx/error.log
elif [ -f "/home/*/logs/error.log" ]; then
    echo "Hosting error log (last 30 lines):"
    tail -30 /home/*/logs/error.log
else
    echo "Looking for web server error logs..."
    find /var/log -name "error.log" -type f 2>/dev/null
fi
echo ""

# Check config cache
echo "7. Checking Laravel cache status..."
php artisan config:show | grep -i log || echo "Config not cached or command failed"
echo ""

# Check PHP version and extensions
echo "8. Checking PHP configuration..."
php -v
echo ""
echo "Required extensions:"
php -m | grep -E "(openssl|pdo|mbstring|tokenizer|xml|ctype|json|bcmath)"
echo ""

# Check composer autoload
echo "9. Checking composer autoload..."
if [ -f "vendor/autoload.php" ]; then
    echo "✓ vendor/autoload.php exists"
else
    echo "✗ vendor/autoload.php NOT found - run composer install"
fi
echo ""

# Test manual log writing
echo "10. Testing manual log write..."
php artisan tinker --execute="Log::info('Test log from diagnose script');"
if [ -f "storage/logs/laravel.log" ]; then
    echo "Log file after test:"
    tail -5 storage/logs/laravel.log
fi
echo ""

echo "========================================="
echo "Diagnosis Complete"
echo "========================================="
