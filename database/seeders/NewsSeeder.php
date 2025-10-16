<?php

namespace Database\Seeders;

use App\Models\News;
use Illuminate\Database\Seeder;

class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $newsData = [
            [
                'title_en' => 'Ministry of Forestry: 84,000 Hectares of Mangroves Rehabilitated Over the Last 5 Years',
                'title_id' => 'Kemenhut: 84.000 Hektare Mangrove Direhabilitasi Selama 5 Tahun Terakhir',
                'content_en' => 'The Director of Mangrove Rehabilitation at the Ministry of Forestry (Kemenhut), Ristianto Pribadi, noted that 84,000 hectares of mangroves have been rehabilitated over the past five years. Meanwhile, the government has set a target of rehabilitating 600,000 hectares of mangroves by 2024.',
                'content_id' => 'Direktur Rehabilitasi Mangrove Kementerian Kehutanan (Kemenhut), Ristianto Pribadi, mencatat 84.000 hektare mangrove telah direhabilitasi selama lima tahun terakhir. Sementara itu, pemerintah menargetkan rehabilitasi 600.000 hektare mangrove pada 2024.',
                'image_url' => 'https://asset.kompas.com/crops/d9sgpv270v6snPcaGa5keLDzrmc=/0x0:0x0/1200x800/data/photo/2025/04/16/67ff72c6aaa61.jpg',
                'external_link' => 'https://lestari.kompas.com/read/2025/04/16/171500786/kemenhut--84.000-hektare-mangrove-direhabilitasi-selama-5-tahun-terakhir-',
                'published_at' => '2025-04-16',
            ],
            [
                'title_en' => 'Supporting a Sustainable Generation, Maybank Indonesia Highlights the Theme of Green Literacy at Global CR Day 2025',
                'title_id' => 'Dukung Generasi Berkelanjutan, Maybank Indonesia Angkat Tema Literasi Hijau di Global CR Day 2025',
                'content_en' => 'PT Bank Maybank Indonesia, Tbk (Maybank Indonesia) held the Global CR Day and Cahaya Kasih programs, which integrate employee volunteering activities with sustainability and literacy initiatives.',
                'content_id' => 'PT Bank Maybank Indonesia, Tbk (Maybank Indonesia) mengadakan program Global CR Day dan Cahaya Kasih yang mengintegrasikan kegiatan volunteering karyawan dengan inisiatif keberlanjutan dan literasi.',
                'image_url' => 'https://asset-2.tribunnews.com/tribunnews/foto/bank/images/Head-of-Sustainability-PT-Bank-Maybank-Indonesia-Tbk-Maria-Trifanny-Fransiska.jpg',
                'external_link' => 'https://www.tribunnews.com/bisnis/7734771/dukung-generasi-berkelanjutan-maybank-indonesia-angkat-tema-literasi-hijau-di-global-cr-day-2025',
                'published_at' => '2025-03-20',
            ],
            [
                'title_en' => 'Students Join Green Movement, 10,000 Seedlings Collected at Environmental Education Center',
                'title_id' => 'Mahasiswa Terlibat dalam Gerakan Hijau, 10.000 Bibit Terkumpul di Pusat Edukasi Lingkungan',
                'content_en' => 'A total of 10,000 tree seedlings were successfully collected in the green movement program involving students from various universities.',
                'content_id' => 'Sebanyak 10.000 bibit pohon berhasil terkumpul dalam program gerakan hijau yang melibatkan mahasiswa dari berbagai universitas.',
                'image_url' => 'https://asset-2.tribunnews.com/tribunnews/foto/bank/images/Gerakan-hijau-libatkan-mahasiswa-dari-50-kampus.jpg',
                'external_link' => 'https://www.tribunnews.com/nasional/7731367/mahasiswa-terlibat-dalam-gerakan-hijau-10000-bibit-terkumpul-di-pusat-edukasi-lingkungan',
                'published_at' => '2025-03-15',
            ],
            [
                'title_en' => 'Green Movement 1 Decade of TIMES Indonesia Begins from Malang',
                'title_id' => 'Gerakan Hijau 1 Dekade TIMES Indonesia Dimulai dari Malang',
                'content_en' => 'TIMES Indonesia celebrated its decade-long journey in a different way—not with congratulatory flower boards, but by planting 10,000 fruit tree seedlings and greenery.',
                'content_id' => 'TIMES Indonesia merayakan perjalanan satu dekade dengan cara berbeda—bukan dengan papan bunga ucapan selamat, melainkan dengan menanam 10.000 bibit pohon buah dan penghijauan.',
                'image_url' => 'https://cdn-1.timesmedia.co.id/images/2025/08/21/TIMES-Indonesia-Tanam-10.000-a.jpg',
                'external_link' => 'https://timesindonesia.co.id/peristiwa-daerah/551097/gerakan-hijau-1-dekade-times-indonesia-dimulai-dari-malang',
                'published_at' => '2025-08-21',
            ],
        ];

        foreach ($newsData as $news) {
            News::create($news);
        }

        $this->command->info('News data seeded successfully!');
    }
}
