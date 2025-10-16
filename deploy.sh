#!/bin/bash

# ==============================================
# Greenesia Deployment Script for Hostinger
# ==============================================
# This script helps automate the deployment process
# ==============================================

echo "🚀 Starting Greenesia Deployment..."
echo ""

# 1. Update composer dependencies (production only)
echo "📦 Installing Composer dependencies (production)..."
composer install --no-dev --optimize-autoloader --no-interaction
echo "✅ Composer dependencies installed"
echo ""

# 2. Clear and cache configurations
echo "⚙️  Optimizing application..."
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
echo "✅ Cache cleared"
echo ""

# 3. Cache configurations for production
echo "💾 Caching configurations..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
echo "✅ Configurations cached"
echo ""

# 4. Run migrations (only if needed - be careful in production!)
read -p "🔄 Do you want to run migrations? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    php artisan migrate --force
    echo "✅ Migrations completed"
else
    echo "⏭️  Skipping migrations"
fi
echo ""

# 5. Link storage
echo "🔗 Linking storage..."
php artisan storage:link
echo "✅ Storage linked"
echo ""

# 6. Build frontend assets (if using npm/vite)
read -p "🎨 Do you want to build frontend assets? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "📦 Installing npm dependencies..."
    npm install
    echo "🏗️  Building assets..."
    npm run build
    echo "✅ Assets built"
else
    echo "⏭️  Skipping asset build"
fi
echo ""

# 7. Set permissions
echo "🔒 Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
echo "✅ Permissions set"
echo ""

# 8. Final optimization
echo "⚡ Final optimization..."
php artisan optimize
echo "✅ Optimization complete"
echo ""

echo "🎉 Deployment completed successfully!"
echo "⚠️  Remember to:"
echo "   - Update your .env file with production credentials"
echo "   - Generate APP_KEY if not set: php artisan key:generate"
echo "   - Check file permissions on the server"
echo "   - Enable HTTPS redirect in public/.htaccess"
echo ""
