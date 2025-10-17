# 🌿 Greenesia - Aplikasi Pemetaan Mangrove & Perkebunan Indonesia

Platform web interaktif untuk visualisasi dan edukasi tentang hutan mangrove dan perkebunan di Indonesia.

## 📋 Deskripsi Project

Greenesia adalah aplikasi Progressive Web App (PWA) yang menyediakan:
- 🗺️ Peta interaktif mangrove dan perkebunan Indonesia
- 📰 Berita dan artikel tentang lingkungan
- 💾 Fitur save lokasi favorit
- 👤 Sistem autentikasi user
- 📱 Support offline dengan PWA

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 11
- **Database:** MySQL
- **Authentication:** Laravel Sanctum
- **Admin Panel:** Filament

### Frontend
- **HTML5, CSS3, JavaScript (Vanilla)**
- **Maps:** Leaflet.js
- **PWA:** Service Worker + Manifest

## 📦 Instalasi & Setup

### Prerequisites
- PHP >= 8.2
- Composer
- MySQL/MariaDB
- Node.js & NPM (optional untuk build assets)

### Langkah Instalasi

1. **Clone Repository**
   ```bash
   git clone https://github.com/bebetterthan/greenwaysia-apps.git
   cd greenwaysia-apps
   ```

2. **Install Dependencies**
   ```bash
   composer install
   ```

3. **Setup Environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Konfigurasi Database**
   
   Edit file `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=greenesia
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. **Run Migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed Data (Optional)**
   ```bash
   php artisan db:seed
   ```

7. **Start Development Server**
   ```bash
   php artisan serve
   ```
   
   Aplikasi akan berjalan di: `http://localhost:8000`

## 📍 Data GeoJSON

File GeoJSON untuk peta mangrove dan perkebunan **TIDAK DISERTAKAN** dalam repository untuk menghemat ukuran project.

### Download Data GeoJSON

File tersedia di **GitHub Release**:
🔗 [Download GeoData Files](https://github.com/bebetterthan/greenwaysia-apps/releases/tag/v1.0)

**File yang tersedia:**
- `Hutan_Mangrove_250K.json` (6.08 MB)
- `Hutan_Mangrove_50K_simplified.json` (15.80 MB)
- `Hutan_Mangrove_25K_simplified.json` (32.40 MB)
- `Perkebunan_indonesia.json` (14.84 MB)

**Sumber Data:** Badan Informasi Geospasial (BIG) Indonesia, 2009

### Cara Setup Data GeoJSON

**Opsi 1: Load dari CDN (Recommended)** ✅
- File otomatis di-load dari GitHub Release
- Tidak perlu download manual
- Aplikasi sudah dikonfigurasi untuk fetch dari CDN

**Opsi 2: Load Lokal** (Untuk development)
1. Download file dari GitHub Release
2. Letakkan di root folder project
3. Update path di `public/maps.html` jika perlu

## 🗂️ Struktur Project

```
greenesia/
├── app/
│   ├── Http/Controllers/    # API Controllers
│   ├── Models/              # Eloquent Models
│   └── Filament/            # Admin Panel Resources
├── database/
│   ├── migrations/          # Database Migrations
│   └── seeders/             # Database Seeders
├── public/                  # Public HTML Pages
│   ├── index.html           # Landing Page
│   ├── maps.html            # Interactive Map
│   ├── news.html            # News Page
│   ├── profile.html         # User Profile
│   └── ...
├── routes/
│   ├── api.php              # API Routes
│   └── web.php              # Web Routes
├── js/                      # JavaScript Files
├── css/                     # Stylesheets
└── img/                     # Images & Assets
```

## 🔑 Fitur Utama

### 1. Peta Interaktif
- Visualisasi data mangrove dengan 3 resolusi
- Data perkebunan Indonesia
- Geolocation user
- Filter dan layer control

### 2. Sistem User
- Register & Login
- Profile management
- Save lokasi favorit
- Change password

### 3. Berita & Artikel
- CRUD berita lingkungan
- Kategori dan tags
- Featured articles

### 4. Admin Panel (Filament)
- Manage users
- Manage news
- Contact messages
- View saved locations

### 5. PWA Support
- Offline access
- Install to home screen
- Push notifications ready

## 🌐 API Endpoints

### Authentication
```
POST   /api/register          - Register user baru
POST   /api/login             - Login user
POST   /api/logout            - Logout (auth required)
GET    /api/me                - Get user info (auth required)
```

### News
```
GET    /api/news              - List all news
GET    /api/news/{id}         - Get single news
```

### Maps Data
```
GET    /api/mangroves         - Get mangrove GeoJSON
GET    /api/plantations       - Get plantation GeoJSON
```

### Saved Locations (Auth Required)
```
GET    /api/saved-locations           - List saved locations
POST   /api/saved-locations           - Save new location
DELETE /api/saved-locations/{id}      - Delete location
```

### Profile (Auth Required)
```
PUT    /api/profile/update            - Update profile
PUT    /api/profile/change-password   - Change password
```

## 🔐 Admin Panel

Akses admin panel di: `/admin`

Default credentials (setelah seed):
```
Email: admin@greenesia.com
Password: password
```

## 📱 PWA Setup

Aplikasi sudah dikonfigurasi sebagai PWA:
- `manifest.json` - App manifest
- `sw.js` - Service Worker
- Offline support

Install di mobile:
1. Buka di browser (Chrome/Edge/Safari)
2. Klik "Add to Home Screen"
3. Aplikasi bisa diakses offline

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 👥 Team

Developed by **Team TIF Polije** untuk Lomba Vokasi

## 📞 Contact

Untuk pertanyaan atau dukungan:
- Email: support@greenesia.com
- Website: [greenesia.com](https://greenesia.com)

## 🙏 Acknowledgments

- Badan Informasi Geospasial (BIG) - Data GeoJSON
- Leaflet.js - Interactive maps
- Laravel Framework
- Filament Admin Panel

---

Made with 💚 for a greener Indonesia 🌱
