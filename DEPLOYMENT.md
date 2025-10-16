# 🚀 Panduan Deployment Greenesia ke Hostinger

## 📋 Daftar Isi
1. [Struktur Folder Hostinger](#struktur-folder-hostinger)
2. [Persiapan Sebelum Upload](#persiapan-sebelum-upload)
3. [Upload ke Hostinger](#upload-ke-hostinger)
4. [Konfigurasi di Hostinger](#konfigurasi-di-hostinger)
5. [Troubleshooting](#troubleshooting)

---

## 📂 Struktur Folder Hostinger

**PENTING:** Baca file `HOSTINGER-SETUP.md` untuk panduan detail tentang struktur folder!

### Struktur Recommended (Symlink Method):
```
/home/uXXXXXXX/
├── domains/yourdomain.com/
│   └── public_html → symlink ke /home/uXXXXXXX/greenesia/public
└── greenesia/              ← Upload Laravel di sini
    ├── app/
    ├── public/
    ├── vendor/
    └── ...
```

**Keuntungan:**
- ✅ File Laravel aman di luar public
- ✅ Mudah update/maintenance
- ✅ Struktur Laravel standar

📖 **Lihat `HOSTINGER-SETUP.md` untuk 3 metode setup yang berbeda!**

---

## 🔧 Persiapan Sebelum Upload

### 1. Build Assets Production
```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

### 2. Optimize Composer
```bash
# Install dependencies untuk production (tanpa dev packages)
composer install --no-dev --optimize-autoloader
```

### 3. Generate Application Key (Jika belum ada)
```bash
php artisan key:generate
```

### 4. Files yang HARUS ada:
- ✅ `.htaccess` (root folder) - untuk redirect ke public
- ✅ `public/.htaccess` - untuk routing Laravel
- ✅ `.env.production` - template untuk production environment

### 5. Files yang JANGAN di-upload:
- ❌ `.env` (file local development)
- ❌ `node_modules/` (terlalu besar, install ulang di server)
- ❌ `.git/` (tidak perlu di production)
- ❌ `tests/` (optional)
- ❌ `.env.example` (optional)
- ❌ `storage/logs/*.log` (hapus log lama)

---

## 📤 Upload ke Hostinger

### Metode 1: File Manager (Untuk File Kecil)
1. Login ke **hPanel Hostinger**
2. Pilih **File Manager**
3. Upload semua files ke folder `public_html` atau `domains/yourdomain.com`

### Metode 2: FTP/SFTP (Direkomendasikan)
1. Download FTP client seperti **FileZilla**
2. Koneksi menggunakan kredensial dari Hostinger:
   ```
   Host: ftp.yourdomain.com atau IP server
   Username: [dari hPanel]
   Password: [dari hPanel]
   Port: 21 (FTP) atau 22 (SFTP)
   ```
3. Upload semua files kecuali yang ada di daftar "JANGAN di-upload"

### Metode 3: Git (Paling Efisien)
1. Push project ke GitHub/GitLab
2. Di Hostinger, gunakan SSH:
   ```bash
   cd public_html
   git clone https://github.com/yourusername/greenesia.git .
   ```

---

## ⚙️ Konfigurasi di Hostinger

### 1. Setup Database MySQL

1. **Buat Database di hPanel:**
   - Masuk ke **MySQL Databases**
   - Klik **Create New Database**
   - Catat: `database name`, `username`, `password`

2. **Import Database (jika ada):**
   ```bash
   # Via SSH atau phpMyAdmin
   mysql -u username -p database_name < backup.sql
   ```

### 2. Setup File .env

1. **Copy template production:**
   ```bash
   # Via SSH
   cp .env.production .env
   ```

2. **Edit file .env:**
   ```bash
   nano .env
   # atau gunakan File Manager editor
   ```

3. **Update konfigurasi penting:**
   ```env
   APP_NAME=Greenesia
   APP_ENV=production
   APP_KEY=base64:... # Generate jika kosong
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost  # atau 127.0.0.1
   DB_PORT=3306
   DB_DATABASE=nama_database_anda
   DB_USERNAME=user_database_anda
   DB_PASSWORD=password_database_anda

   # Mail configuration (Hostinger SMTP)
   MAIL_MAILER=smtp
   MAIL_HOST=smtp.hostinger.com
   MAIL_PORT=587
   MAIL_USERNAME=your-email@yourdomain.com
   MAIL_PASSWORD=your-email-password
   MAIL_ENCRYPTION=tls
   MAIL_FROM_ADDRESS=your-email@yourdomain.com
   MAIL_FROM_NAME="Greenesia"
   ```

### 3. Generate Application Key
```bash
php artisan key:generate
```

### 4. Set Permissions (PENTING!)
```bash
# Via SSH
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod -R 755 public

# Atau via File Manager:
# Klik kanan folder > Change Permissions > 755
```

### 5. Run Migrations
```bash
php artisan migrate --force
```

### 6. Link Storage
```bash
php artisan storage:link
```

### 7. Cache Konfigurasi
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

### 8. Setup PHP Version
1. Di **hPanel > Advanced > Select PHP Version**
2. Pilih **PHP 8.2** atau lebih tinggi
3. Enable extensions yang dibutuhkan:
   - ✅ mbstring
   - ✅ xml
   - ✅ openssl
   - ✅ pdo_mysql
   - ✅ curl
   - ✅ gd
   - ✅ fileinfo
   - ✅ tokenizer

---

## 🔒 Security Checklist

- [ ] `APP_DEBUG=false` di production
- [ ] `APP_ENV=production`
- [ ] File `.env` tidak bisa diakses public
- [ ] SSL/HTTPS sudah aktif
- [ ] Uncomment force HTTPS di `public/.htaccess`
- [ ] Database password kuat
- [ ] Update semua packages: `composer update`

---

## 🌐 Enable HTTPS (Wajib!)

### 1. Aktifkan SSL di Hostinger
1. Masuk **hPanel > SSL**
2. Install **Free SSL Certificate** (Let's Encrypt)
3. Tunggu hingga aktif (~15 menit)

### 2. Force HTTPS di Laravel
Edit `public/.htaccess`, uncomment baris ini:
```apache
# Force HTTPS (uncomment for production)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🐛 Troubleshooting

### Error: "500 Internal Server Error"
**Solusi:**
1. Cek file `.env` sudah ada dan konfigurasi benar
2. Generate key: `php artisan key:generate`
3. Cek permissions folder `storage` dan `bootstrap/cache` (755)
4. Cek PHP version minimal 8.2
5. Cek error log: `storage/logs/laravel.log`

### Error: "No application encryption key has been specified"
**Solusi:**
```bash
php artisan key:generate
```

### Error: Database Connection
**Solusi:**
1. Cek kredensial database di `.env`
2. Pastikan `DB_HOST=localhost` bukan `127.0.0.1`
3. Test koneksi database via phpMyAdmin

### Error: Permission Denied
**Solusi:**
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### Error: Assets/CSS Tidak Load
**Solusi:**
1. Pastikan `APP_URL` di `.env` sesuai domain
2. Run: `php artisan storage:link`
3. Rebuild assets: `npm run build`
4. Clear cache: `php artisan cache:clear`

### Error: Route Not Found / 404
**Solusi:**
1. Pastikan file `.htaccess` ada di root dan di `public/`
2. Clear route cache: `php artisan route:clear`
3. Check Apache mod_rewrite enabled

### Filament Admin Panel Tidak Bisa Login
**Solusi:**
1. Reset admin user via tinker:
   ```bash
   php artisan tinker
   >>> $admin = App\Models\Admin::first();
   >>> $admin->password = bcrypt('newpassword');
   >>> $admin->save();
   ```
2. Atau buat ulang via seeder:
   ```bash
   php artisan db:seed --class=AdminSeeder
   ```

---

## 📝 Script Deployment Otomatis

Untuk memudahkan deployment, gunakan script yang sudah disediakan:

### Linux/Mac:
```bash
bash deploy.sh
```

### Windows:
```bash
deploy.bat
```

Script ini akan otomatis:
- Install composer dependencies
- Clear & cache konfigurasi
- Run migrations (opsional)
- Link storage
- Build assets (opsional)
- Set permissions
- Optimize aplikasi

---

## 🔄 Update/Re-deployment

Ketika melakukan update di masa depan:

```bash
# 1. Pull changes (jika pakai Git)
git pull origin main

# 2. Update dependencies
composer install --no-dev --optimize-autoloader

# 3. Run migrations
php artisan migrate --force

# 4. Clear & cache
php artisan config:clear
php artisan cache:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 5. Rebuild assets (jika ada perubahan frontend)
npm install
npm run build

# 6. Optimize
php artisan optimize
```

Atau gunakan script deployment:
```bash
bash deploy.sh
```

---

## 📞 Support

Jika mengalami kendala:
1. Cek `storage/logs/laravel.log`
2. Enable debug sementara: `APP_DEBUG=true`
3. Cek dokumentasi Laravel: https://laravel.com/docs
4. Support Hostinger: https://www.hostinger.com/support

---

## ✅ Checklist Final

Sebelum go-live, pastikan:

- [ ] Database terkoneksi dengan baik
- [ ] File `.env` sudah dikonfigurasi dengan benar
- [ ] `APP_DEBUG=false` di production
- [ ] SSL/HTTPS sudah aktif
- [ ] Permissions folder sudah benar (755)
- [ ] Admin panel bisa diakses
- [ ] Email notifikasi berfungsi
- [ ] Assets (CSS/JS) load dengan benar
- [ ] Semua fitur utama berfungsi normal
- [ ] Backup database sudah dilakukan

---

**🎉 Selamat! Website Greenesia Anda sudah live di Hostinger!**

---

*Dibuat untuk memudahkan deployment Laravel ke Hostinger*
*Last updated: October 2025*
