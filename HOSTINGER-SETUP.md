# 🏠 Setup Struktur Folder untuk Hostinger

## 📂 Struktur Folder Hostinger

Hostinger menggunakan struktur folder seperti ini:
```
/home/uXXXXXXX/
├── domains/
│   └── yourdomain.com/
│       └── public_html/  ← Document Root (yang bisa diakses public)
└── greenesia/            ← Aplikasi Laravel (di luar public_html)
    ├── app/
    ├── bootstrap/
    ├── config/
    ├── database/
    ├── public/           ← Isi folder ini akan dipindah ke public_html
    ├── resources/
    ├── routes/
    ├── storage/
    └── vendor/
```

## 🎯 2 Metode Setup untuk Hostinger

---

## **METODE 1: Symlink Public Folder (RECOMMENDED)**

Ini metode paling aman dan mudah maintenance.

### Langkah-langkah:

1. **Upload semua file Laravel ke folder di LUAR public_html:**
   ```bash
   # Via SSH
   cd /home/uXXXXXXX/
   # Upload atau git clone di sini
   git clone https://github.com/yourusername/greenesia.git
   # atau upload via FTP ke folder /home/uXXXXXXX/greenesia/
   ```

2. **Hapus folder public_html yang ada:**
   ```bash
   cd /home/uXXXXXXX/domains/yourdomain.com/
   rm -rf public_html
   ```

3. **Buat symlink dari public_html ke folder public Laravel:**
   ```bash
   ln -s /home/uXXXXXXX/greenesia/public public_html
   ```

4. **Verifikasi:**
   ```bash
   ls -la
   # Harus muncul: public_html -> /home/uXXXXXXX/greenesia/public
   ```

### Keuntungan Metode 1:
✅ Folder app, config, database, dll tetap aman di luar public  
✅ Mudah update (tinggal git pull di folder greenesia)  
✅ Tidak perlu copy-paste file  
✅ Struktur Laravel standar tetap terjaga  

### File .htaccess (TIDAK PERLU di root)
Karena menggunakan symlink, `.htaccess` di root tidak diperlukan.

---

## **METODE 2: Copy Manual ke public_html**

Jika server tidak support symlink atau Anda lebih suka struktur tradisional.

### Langkah-langkah:

1. **Upload semua file Laravel ke folder di LUAR public_html:**
   ```
   /home/uXXXXXXX/greenesia/
   ```

2. **Copy isi folder public ke public_html:**
   ```bash
   # Via SSH
   cp -r /home/uXXXXXXX/greenesia/public/* /home/uXXXXXXX/domains/yourdomain.com/public_html/
   ```

3. **Update index.php di public_html:**
   
   Edit file: `/home/uXXXXXXX/domains/yourdomain.com/public_html/index.php`
   
   Ubah path ini:
   ```php
   require __DIR__.'/../vendor/autoload.php';
   $app = require_once __DIR__.'/../bootstrap/app.php';
   ```
   
   Menjadi (sesuaikan path ke folder greenesia):
   ```php
   require __DIR__.'/../../greenesia/vendor/autoload.php';
   $app = require_once __DIR__.'/../../greenesia/bootstrap/app.php';
   ```

4. **Copy file .htaccess ke public_html:**
   ```bash
   cp /home/uXXXXXXX/greenesia/public/.htaccess /home/uXXXXXXX/domains/yourdomain.com/public_html/
   ```

### Keuntungan Metode 2:
✅ Kompatibel dengan semua server  
✅ Lebih familiar untuk shared hosting  

### Kekurangan:
❌ Setiap update harus copy manual  
❌ Path harus di-adjust di index.php  

---

## **METODE 3: Semua di public_html (NOT RECOMMENDED)**

Upload semua file termasuk folder app, config, dll ke dalam public_html.

### ⚠️ BAHAYA KEAMANAN:
- Folder `app/`, `config/`, `.env` bisa diakses public jika ada misconfiguration
- File sensitif terekspos ke internet
- **TIDAK DISARANKAN untuk production**

Gunakan metode ini hanya untuk testing saja.

---

## 🔧 Konfigurasi Setelah Upload

Setelah memilih salah satu metode di atas:

### 1. Set Permissions:
```bash
cd /home/uXXXXXXX/greenesia/
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

### 2. Setup .env:
```bash
cp .env.production .env
nano .env
# Update database credentials dan APP_URL
```

### 3. Install Dependencies:
```bash
composer install --no-dev --optimize-autoloader
```

### 4. Generate Key & Migrate:
```bash
php artisan key:generate
php artisan migrate --force
php artisan storage:link
```

### 5. Cache Configuration:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan optimize
```

---

## 🔍 Cara Mengetahui Path di Hostinger

### Via SSH:
```bash
pwd
# Output: /home/uXXXXXXX/
```

### Via PHP Info:
Buat file `info.php` di public_html:
```php
<?php
echo __DIR__;
phpinfo();
?>
```
Akses: https://yourdomain.com/info.php  
**HAPUS SETELAH LIHAT!**

---

## 📋 Checklist Setup Public_html

- [ ] Tentukan metode (Symlink / Copy Manual / All-in-one)
- [ ] Upload file Laravel ke folder yang tepat
- [ ] Setup public_html sesuai metode yang dipilih
- [ ] Update path di index.php (jika metode 2)
- [ ] Copy/setup .htaccess di public_html
- [ ] Set permissions storage & bootstrap/cache
- [ ] Setup file .env dengan credentials yang benar
- [ ] Run migrations dan seed database
- [ ] Cache konfigurasi Laravel
- [ ] Test website berfungsi normal
- [ ] Hapus file info.php jika ada

---

## 🐛 Troubleshooting public_html

### Error: "No input file specified"
**Solusi:** Check path di `index.php` sudah benar menuju folder Laravel

### Error: "Class not found" / Composer issues
**Solusi:** Run `composer dump-autoload` di folder Laravel

### Error: Static assets (CSS/JS) tidak load
**Solusi:** 
- Check `APP_URL` di .env
- Pastikan file CSS/JS ada di public_html
- Check permissions: `chmod -R 755 public_html`

### Symlink tidak berfungsi
**Solusi:**
- Pastikan SSH access enabled
- Kontak support Hostinger untuk enable symlink
- Gunakan Metode 2 sebagai alternatif

---

## 💡 Rekomendasi

**Untuk Hostinger Shared Hosting:**  
👉 Gunakan **METODE 1 (Symlink)** - Paling aman dan mudah maintenance

**Jika symlink tidak support:**  
👉 Gunakan **METODE 2 (Copy Manual)** - Tetap aman karena core files di luar public

**Jangan gunakan Metode 3** kecuali untuk testing singkat saja.

---

*Panduan ini dibuat khusus untuk struktur folder Hostinger*  
*Last updated: October 2025*
