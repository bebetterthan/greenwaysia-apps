#!/bin/bash
# Quick update script - Copy paste this to SSH terminal

echo "🔄 Updating website from GitHub..."

# Pull latest changes
git pull origin main

# Clear browser cache on server side
echo "🧹 Clearing Laravel cache..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild cache
echo "💾 Rebuilding cache..."
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize

echo "✅ Update complete!"
echo ""
echo "⚠️  IMPORTANT: Clear browser cache:"
echo "   1. Press Ctrl+Shift+Delete"
echo "   2. Clear 'Cached images and files'"
echo "   3. Or press Ctrl+Shift+R for hard refresh"
echo ""
echo "   Or test in Incognito mode (Ctrl+Shift+N)"
