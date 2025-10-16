<?php

namespace Database\Seeders;

use App\Models\Mangrove;
use Illuminate\Database\Seeder;

class MangroveSeeder extends Seeder
{
    public function run(): void
    {
        $files = [
            '25k' => base_path('../Web-Lomba-Vokasi_UB-main/Hutan_Mangrove_25K_simplified.json'),
            '50k' => base_path('../Web-Lomba-Vokasi_UB-main/Hutan_Mangrove_50K_simplified.json'),
            '250k' => base_path('../Web-Lomba-Vokasi_UB-main/Hutan_Mangrove_250K.json'),
        ];

        foreach ($files as $resolution => $filePath) {
            if (!file_exists($filePath)) {
                $this->command->warn("File not found: {$filePath}");
                continue;
            }

            $this->command->info("Importing mangrove data ({$resolution})...");

            $json = file_get_contents($filePath);
            $data = json_decode($json, true);

            if (!isset($data['features'])) {
                $this->command->error("Invalid GeoJSON format for {$resolution}");
                continue;
            }

            foreach ($data['features'] as $feature) {
                Mangrove::create([
                    'resolution' => $resolution,
                    'geometry' => json_encode($feature['geometry']),
                    'properties' => json_encode($feature['properties'] ?? []),
                ]);
            }

            $this->command->info("Mangrove data ({$resolution}) imported successfully!");
        }
    }
}
