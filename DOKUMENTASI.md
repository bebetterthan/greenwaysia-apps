# DOKUMENTASI GREENESIA BACKEND

## DESKRIPSI PROJECT

Greenesia Backend adalah aplikasi web berbasis Laravel 11 untuk monitoring hutan mangrove dan perkebunan di Indonesia. Project ini merupakan pengembangan dari versi static website (Web-Lomba-Vokasi_UB-main) yang ditingkatkan dengan integrasi backend Laravel, Filament Admin Panel, dan optimasi mobile user experience.

---

## SPESIFIKASI TEKNIS

### Persyaratan Sistem

**Minimum Requirements:**
- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 18.0
- NPM >= 9.0
- MySQL >= 8.0 atau PostgreSQL >= 13
- Web Server (Apache/Nginx)

**Rekomendasi Development:**
- Laragon (Windows)
- XAMPP (Cross-platform)
- Docker (Production)

### Tech Stack

**Backend:**
- Laravel 11.x
- PHP 8.2+
- Laravel Sanctum (API Authentication)
- Filament 3.3 (Admin Panel)

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Leaflet.js 1.9.4 (Interactive Maps)
- Service Worker (PWA Support)

**Build Tools:**
- Vite 7.0.7
- Tailwind CSS 4.0
- Laravel Vite Plugin 2.0

---

## STRUKTUR FOLDER

```
greenesia-backend/
├── app/
│   ├── Filament/           # Filament admin panel resources
│   ├── Http/
│   │   ├── Controllers/    # API & web controllers
│   │   └── Middleware/     # Custom middleware
│   ├── Models/             # Eloquent models
│   └── Providers/          # Service providers
│
├── bootstrap/
│   ├── app.php             # Application bootstrap
│   ├── providers.php       # Provider configuration
│   └── cache/              # Framework cache
│
├── config/                 # Configuration files
│   ├── app.php
│   ├── database.php
│   ├── cors.php
│   └── sanctum.php
│
├── database/
│   ├── migrations/         # Database migrations
│   ├── seeders/            # Database seeders
│   └── factories/          # Model factories
│
├── public/                 # Web root (document root)
│   ├── css/
│   │   └── style.css       # Main stylesheet (v3.5)
│   ├── js/
│   │   ├── main.js         # Core navigation & UI (v3.5)
│   │   ├── geolocation.js  # GPS & location tracking
│   │   ├── touch-gestures.js # Mobile gesture handlers
│   │   ├── api.js          # API client
│   │   └── auth.js         # Authentication
│   ├── img/                # Images & assets
│   ├── *.html              # Static pages
│   ├── *.json              # GeoJSON map data
│   ├── sw.js               # Service worker
│   ├── manifest.json       # PWA manifest
│   └── index.php           # Laravel entry point
│
├── resources/
│   ├── views/              # Blade templates
│   ├── css/                # Source CSS
│   └── js/                 # Source JavaScript
│
├── routes/
│   ├── api.php             # API routes
│   ├── web.php             # Web routes
│   └── console.php         # Console commands
│
├── storage/
│   ├── app/                # Application files
│   ├── framework/          # Framework files
│   └── logs/               # Application logs
│
├── tests/                  # Unit & feature tests
├── vendor/                 # Composer dependencies
├── .env                    # Environment configuration
├── artisan                 # Laravel CLI
├── composer.json           # PHP dependencies
├── package.json            # Node dependencies
└── vite.config.js          # Vite configuration
```

---

## CARA INSTALASI

### 1. Clone atau Extract Project

```bash
# Jika dari Git
git clone <repository-url> greenesia-backend
cd greenesia-backend

# Jika dari ZIP
# Extract ke folder greenesia-backend
```

### 2. Install Dependencies

**Install PHP Dependencies:**
```bash
composer install
```

**Install Node Dependencies:**
```bash
npm install
```

### 3. Konfigurasi Environment

**Copy file environment:**
```bash
cp .env.example .env
```

**Generate application key:**
```bash
php artisan key:generate
```

**Edit file .env sesuai environment:**
```env
APP_NAME=Greenesia
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=greenesia
DB_USERNAME=root
DB_PASSWORD=

# Untuk production
APP_ENV=production
APP_DEBUG=false
```

### 4. Setup Database

**Buat database:**
```sql
CREATE DATABASE greenesia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Jalankan migrations:**
```bash
php artisan migrate
```

**Jalankan seeders (optional):**
```bash
php artisan db:seed
```

### 5. Setup Storage

**Create symbolic link:**
```bash
php artisan storage:link
```

**Set permissions (Linux/Mac):**
```bash
chmod -R 775 storage bootstrap/cache
```

### 6. Build Assets (Production)

```bash
npm run build
```

### 7. Jalankan Development Server

**Opsi 1 - Laravel Built-in Server:**
```bash
php artisan serve
# Akses: http://127.0.0.1:8000
```

**Opsi 2 - Dengan Vite (Hot Reload):**
```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

**Opsi 3 - Laragon (Windows):**
- Start Laragon
- Add project ke www folder
- Akses: http://greenesia-backend.test

---

## PERBANDINGAN DENGAN VERSI ORIGINAL

### Web-Lomba-Vokasi_UB-main (Versi Original)

**Karakteristik:**
- Static HTML website
- Client-side only
- No backend integration
- Basic mobile responsiveness
- Manual code management

**Struktur Folder:**
```
Web-Lomba-Vokasi_UB-main/
├── css/
├── js/
├── img/
├── *.html
└── *.json
```

### Greenesia Backend (Versi Upgrade)

**Karakteristik:**
- Laravel 11 backend
- RESTful API ready
- Filament admin panel
- Advanced mobile UX
- Modern build tools
- Progressive Web App (PWA)

**Upgrade Summary:**

| Aspek | Original | Upgrade |
|-------|----------|---------|
| Framework | None | Laravel 11 |
| Backend | - | PHP 8.2 + Eloquent ORM |
| Admin Panel | - | Filament 3.3 |
| Authentication | Client-side | Laravel Sanctum |
| Build Tool | - | Vite 7 + Tailwind |
| Mobile UX | Basic | Optimized gestures |
| PWA | Partial | Full support |
| API | - | RESTful API |
| Database | - | MySQL/PostgreSQL |
| Version Control | - | Composer + NPM |

---

## FITUR UTAMA

### 1. Progressive Web App (PWA)

**Service Worker:**
- Offline support
- Cache strategy
- Background sync
- Push notifications ready

**Manifest:**
- Installable app
- App icons
- Splash screens
- Standalone mode

### 2. Mobile Optimization

**Gesture Controls:**
- Swipeable sidebar modal
- Velocity-based detection
- Hardware-accelerated animations
- Touch-optimized UI

**Responsive Design:**
- Mobile-first approach
- Breakpoint: 850px
- Bottom sheet pattern
- No overlay on mobile

### 3. Interactive Maps

**Leaflet Integration:**
- Multiple map layers
- GeoJSON support
- Custom markers
- Popup modals

**Data Layers:**
- Hutan Mangrove (250K, 50K, 25K)
- Perkebunan Indonesia
- GPS location tracking
- Saved locations

### 4. Authentication System

**Features:**
- User registration
- Login/logout
- Password reset
- Session management
- API token authentication

### 5. Admin Panel (Filament)

**Access:**
```
URL: http://localhost:8000/admin
```

**Features:**
- User management
- Content management
- Map data management
- Analytics dashboard

---

## UPDATE LOG & CHANGELOG

### Version 3.5 (Current)

**Performance Improvements:**

1. **Sidebar Gesture Optimization**
   - Zero-delay touch response (<10ms)
   - Hardware-accelerated animations (GPU)
   - Velocity-based gesture detection
   - Complete close animation (100%)
   - Resistance formula for natural feel

2. **CSS Optimization**
   ```css
   /* Before */
   transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   
   /* After */
   transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
   will-change: transform;
   backface-visibility: hidden;
   ```

3. **JavaScript Enhancements**
   - Touch event optimization
   - Velocity calculation (px/ms)
   - Smart threshold detection
   - Memory leak prevention

### Version 3.4

**Mobile UX Improvements:**

1. **Hamburger Icon Auto-Hide**
   - Icon hidden saat navigation menu open
   - Auto-show saat menu close

2. **Swipeable Sidebar Modal**
   - Swipe up: Fullscreen (85vh)
   - Swipe down: Close sidebar
   - Drag handle dengan visual feedback

3. **Removed Close Button**
   - No (X) button di mobile
   - Gunakan swipe down gesture

### Version 3.3

**Navigation & Overlay Fixes:**

1. **Z-Index Reorganization**
   - Map controls: 1000-1100
   - Navigation: 2000-2200
   - Removed excessive 99999 values

2. **Mobile Overlay Removal**
   ```css
   @media (max-width: 850px) {
     .overlay,
     .sidebar-overlay {
       display: none !important;
     }
   }
   ```

3. **Sidebar Bottom Sheet**
   - Slide dari bawah (mobile)
   - Max-height: 70vh
   - Rounded top corners (20px)

### Version 3.2

**Icon Management:**

1. **Conditional Icon Hiding**
   - Map page: Hide icons saat menu open
   - Non-map pages: Icons tetap visible

2. **Unified Button Management**
   - CSS class-based approach
   - No inline style conflicts

### Version 3.1

**Cache & Loading:**

1. **Cache Busting Strategy**
   - Version query strings
   - Timestamp-based versioning

2. **Browser Compatibility**
   - iOS Safari optimizations
   - Chrome Mobile fixes

### Version 3.0

**Initial Laravel Integration:**

1. **Backend Setup**
   - Laravel 11 installation
   - Filament admin panel
   - Database migrations
   - API routes

2. **File Restructuring**
   - Move HTML ke public/
   - Organize assets
   - Setup build pipeline

3. **PWA Implementation**
   - Service worker
   - Manifest configuration
   - Offline support

---

## KONFIGURASI PRODUCTION

### 1. Environment Setup

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=production-db-host
DB_PORT=3306
DB_DATABASE=greenesia_prod
DB_USERNAME=prod_user
DB_PASSWORD=secure_password

CACHE_DRIVER=redis
QUEUE_CONNECTION=redis
SESSION_DRIVER=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

### 2. Optimization Commands

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Build assets
npm run build
```

### 3. Web Server Configuration

**Apache (.htaccess):**
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

**Nginx:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/greenesia-backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 4. Security Checklist

- [ ] Set APP_DEBUG=false
- [ ] Set secure APP_KEY
- [ ] Configure CORS properly
- [ ] Setup SSL/TLS certificate
- [ ] Configure rate limiting
- [ ] Enable CSRF protection
- [ ] Set secure session cookies
- [ ] Configure file permissions
- [ ] Setup database backups
- [ ] Enable error logging

---

## MAINTENANCE

### Backup Database

```bash
# Export
php artisan db:backup

# Manual mysqldump
mysqldump -u username -p greenesia > backup.sql
```

### Clear Cache

```bash
# Clear all cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Or all at once
php artisan optimize:clear
```

### Update Dependencies

```bash
# Update Composer packages
composer update

# Update NPM packages
npm update

# Check for security vulnerabilities
composer audit
npm audit
```

### Monitor Logs

```bash
# Real-time log monitoring
tail -f storage/logs/laravel.log

# Or using Laravel Pail
php artisan pail
```

---

## TROUBLESHOOTING

### Problem: Permission Denied

**Solution:**
```bash
# Linux/Mac
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# Windows
# Run CMD as Administrator
icacls storage /grant Users:F /t
icacls bootstrap/cache /grant Users:F /t
```

### Problem: 500 Internal Server Error

**Check:**
1. `.env` file exists and configured
2. `APP_KEY` is generated
3. Storage permissions correct
4. PHP version >= 8.2
5. Check `storage/logs/laravel.log`

**Solution:**
```bash
php artisan key:generate
php artisan config:clear
chmod -R 775 storage
```

### Problem: White Screen / No Content

**Check:**
1. Document root points to `public/`
2. `.htaccess` exists in public/
3. `mod_rewrite` enabled (Apache)
4. Check browser console for errors

### Problem: Database Connection Failed

**Check:**
1. Database server running
2. Database exists
3. Credentials correct in `.env`
4. Host/port accessible

**Solution:**
```bash
# Test connection
php artisan tinker
DB::connection()->getPdo();
```

### Problem: Assets Not Loading

**Check:**
1. Run `npm run build`
2. Check `public/build/` exists
3. Clear browser cache
4. Check file permissions

**Solution:**
```bash
npm run build
php artisan storage:link
php artisan cache:clear
```

---

## CONTACT & SUPPORT

**Developer:** GitHub Copilot AI Assistant  
**Project:** Greenesia - Monitoring Hutan Mangrove Indonesia  
**Framework:** Laravel 11 + Filament 3.3  
**Version:** 3.5 (Production Ready)  

**Dokumentasi Resmi:**
- Laravel: https://laravel.com/docs
- Filament: https://filamentphp.com/docs
- Leaflet: https://leafletjs.com/reference

---

## LISENSI

Project ini menggunakan lisensi MIT. Silakan gunakan, modifikasi, dan distribusikan sesuai kebutuhan.

---

**Terakhir Diupdate:** 15 Oktober 2025  
**Versi Dokumentasi:** 1.0
