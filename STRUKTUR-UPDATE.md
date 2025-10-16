# ⚠️ PENTING - Struktur Telah Diubah untuk Hostinger

## 🔄 Perubahan yang Dilakukan

Project ini telah diubah strukturnya agar kompatibel dengan Hostinger shared hosting:

### ✅ Yang Dilakukan:
1. **Semua file dari `public/` dipindah ke root project**
   - File HTML, CSS, JS, images sekarang ada di root
   - File `index.php` sekarang di root project
   
2. **Path di `index.php` sudah diupdate**
   - Dari: `__DIR__.'/../vendor/autoload.php'`
   - Ke: `__DIR__.'/vendor/autoload.php'`
   
3. **`.htaccess` sudah diganti**
   - Menggunakan `.htaccess` dari folder public
   - Sudah dioptimasi untuk production

### 📂 Struktur Sekarang:
```
greenesia/
├── index.php           ← Entry point (dulu di public/)
├── .htaccess           ← Laravel routing (dulu di public/)
├── css/                ← Assets (dulu di public/)
├── js/                 ← Assets (dulu di public/)
├── img/                ← Assets (dulu di public/)
├── about.html          ← Static pages (dulu di public/)
├── app/                ← Laravel core
├── bootstrap/          ← Laravel bootstrap
├── config/             ← Configuration
├── database/           ← Migrations & seeders
├── resources/          ← Views & raw assets
├── routes/             ← Route definitions
├── storage/            ← Logs & cache
├── vendor/             ← Composer packages
└── public/             ← Folder ini masih ada tapi tidak digunakan
```

## 🚀 Deployment ke Hostinger

### Upload ke Hostinger:
Sekarang Anda bisa upload **langsung ke `public_html`**:

```bash
# Via Git (Recommended)
cd /home/uXXXXXXX/public_html
git clone https://github.com/bebetterthan/greenwaysia-apps.git .

# Via FTP
# Upload semua file ke folder public_html
```

### Setup di Server:

1. **Install Dependencies:**
   ```bash
   composer install --no-dev --optimize-autoloader
   ```

2. **Setup Environment:**
   ```bash
   cp .env.production .env
   nano .env  # Edit dengan credentials Anda
   ```

3. **Generate Key & Migrate:**
   ```bash
   php artisan key:generate
   php artisan migrate --force
   ```

4. **Set Permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

5. **Cache & Optimize:**
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   php artisan optimize
   ```

**ATAU gunakan script deployment:**
```bash
bash deploy.sh
```

## ✅ Keuntungan Struktur Baru:

1. ✅ **Langsung accessible** - Domain langsung bisa diakses tanpa `/public`
2. ✅ **Kompatibel dengan Hostinger** - Struktur standard shared hosting
3. ✅ **Tidak perlu symlink** - Lebih mudah setup
4. ✅ **Error 403 fixed** - Website langsung bisa diakses

## ⚠️ Notes:

- Folder `public/` masih ada tapi **TIDAK DIGUNAKAN** lagi
- Kalau mau hapus folder `public/` (optional): `rm -rf public/`
- Website sekarang bisa diakses langsung di domain root, tidak perlu `/public` lagi

## 🔒 Security:

File sensitif tetap aman karena:
- `.htaccess` mencegah akses ke file `.env`
- Folder `vendor/`, `app/`, `config/` dilindungi oleh Laravel routing
- Directory browsing disabled

## 🐛 Troubleshooting:

### Masih Error 403?
- Check permissions: `chmod -R 755 storage bootstrap/cache`
- Check `.htaccess` ada di root
- Check PHP version minimal 8.2

### Assets tidak load?
- Update `APP_URL` di `.env`
- Run: `php artisan cache:clear`

### Error 500?
- Check `.env` file ada dan valid
- Run: `php artisan key:generate`
- Check error log: `storage/logs/laravel.log`

---

**Struktur ini sudah SIAP untuk deployment ke Hostinger! 🎉**

---

*Last updated: October 16, 2025*
*Commit: 8d225bc - "Move public files to root for Hostinger deployment"*
