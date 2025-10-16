#!/bin/bash

# ==============================================
# Hostinger Setup Script (Symlink Method)
# ==============================================
# Script ini untuk setup Laravel dengan symlink
# Jalankan via SSH di Hostinger
# ==============================================

echo "================================================"
echo "  Hostinger Setup Script - Greenesia"
echo "================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get current directory
CURRENT_DIR=$(pwd)
echo "Current directory: $CURRENT_DIR"
echo ""

# Ask for Laravel folder location
read -p "Enter full path to Laravel folder (e.g. /home/u123456789/greenesia): " LARAVEL_PATH

# Validate Laravel path
if [ ! -d "$LARAVEL_PATH" ]; then
    echo -e "${RED}Error: Laravel folder not found at $LARAVEL_PATH${NC}"
    exit 1
fi

if [ ! -f "$LARAVEL_PATH/artisan" ]; then
    echo -e "${RED}Error: Not a valid Laravel folder (artisan not found)${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Laravel folder found${NC}"
echo ""

# Ask for public_html path
read -p "Enter full path to public_html folder (e.g. /home/u123456789/domains/yourdomain.com/public_html): " PUBLIC_HTML_PATH

# Get parent directory
PUBLIC_HTML_PARENT=$(dirname "$PUBLIC_HTML_PATH")

# Validate parent exists
if [ ! -d "$PUBLIC_HTML_PARENT" ]; then
    echo -e "${RED}Error: Parent directory not found: $PUBLIC_HTML_PARENT${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Parent directory found${NC}"
echo ""

# Show summary
echo "================================================"
echo "  Setup Summary"
echo "================================================"
echo "Laravel Path:      $LARAVEL_PATH"
echo "Public HTML Path:  $PUBLIC_HTML_PATH"
echo "Symlink Command:   ln -s $LARAVEL_PATH/public $PUBLIC_HTML_PATH"
echo ""

read -p "Continue with setup? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Setup cancelled."
    exit 0
fi

# Remove existing public_html if exists
if [ -d "$PUBLIC_HTML_PATH" ] || [ -L "$PUBLIC_HTML_PATH" ]; then
    echo "Removing existing public_html..."
    rm -rf "$PUBLIC_HTML_PATH"
    echo -e "${GREEN}✓ Removed existing public_html${NC}"
fi

# Create symlink
echo "Creating symlink..."
cd "$PUBLIC_HTML_PARENT"
ln -s "$LARAVEL_PATH/public" $(basename "$PUBLIC_HTML_PATH")

if [ -L "$PUBLIC_HTML_PATH" ]; then
    echo -e "${GREEN}✓ Symlink created successfully${NC}"
else
    echo -e "${RED}✗ Failed to create symlink${NC}"
    exit 1
fi

echo ""

# Set permissions
echo "Setting permissions..."
cd "$LARAVEL_PATH"
chmod -R 755 storage
chmod -R 755 bootstrap/cache
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

# Check if .env exists
if [ ! -f "$LARAVEL_PATH/.env" ]; then
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    if [ -f "$LARAVEL_PATH/.env.production" ]; then
        read -p "Copy .env.production to .env? (y/n): " -n 1 -r
        echo ""
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp "$LARAVEL_PATH/.env.production" "$LARAVEL_PATH/.env"
            echo -e "${GREEN}✓ .env created from .env.production${NC}"
            echo -e "${YELLOW}⚠ Don't forget to edit .env with your database credentials${NC}"
        fi
    fi
else
    echo -e "${GREEN}✓ .env file exists${NC}"
fi
echo ""

# Ask to run deployment commands
read -p "Run deployment commands? (composer install, migrations, cache, etc.) (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Running deployment commands..."
    echo ""
    
    # Composer install
    echo "[1/7] Installing composer dependencies..."
    composer install --no-dev --optimize-autoloader --no-interaction
    echo ""
    
    # Generate key if needed
    echo "[2/7] Checking APP_KEY..."
    php artisan key:generate --force
    echo ""
    
    # Clear cache
    echo "[3/7] Clearing cache..."
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    echo ""
    
    # Run migrations
    read -p "[4/7] Run migrations? (y/n): " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        php artisan migrate --force
    fi
    echo ""
    
    # Storage link
    echo "[5/7] Creating storage link..."
    php artisan storage:link
    echo ""
    
    # Cache config
    echo "[6/7] Caching configuration..."
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    echo ""
    
    # Optimize
    echo "[7/7] Optimizing..."
    php artisan optimize
    echo ""
fi

echo ""
echo "================================================"
echo "  Setup Complete! 🎉"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your database credentials"
echo "2. Set PHP version to 8.2+ in hPanel"
echo "3. Enable SSL certificate in hPanel"
echo "4. Test your website: https://yourdomain.com"
echo ""
echo "Troubleshooting:"
echo "- Check logs: tail -f $LARAVEL_PATH/storage/logs/laravel.log"
echo "- Verify symlink: ls -la $PUBLIC_HTML_PATH"
echo "- Check permissions: ls -la $LARAVEL_PATH/storage"
echo ""
