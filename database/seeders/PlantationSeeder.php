<?php

namespace Database\Seeders;

use App\Models\Plantation;
use Illuminate\Database\Seeder;

class PlantationSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = base_path('../Web-Lomba-Vokasi_UB-main/Perkebunan_indonesia.json');

        if (!file_exists($jsonPath)) {
            $this->command->error("GeoJSON file not found at: {$jsonPath}");
            return;
        }

        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        if (!isset($data['features'])) {
            $this->command->error("Invalid GeoJSON format");
            return;
        }

        $this->command->info('Importing plantation data...');

        foreach ($data['features'] as $feature) {
            $properties = $feature['properties'] ?? [];

            Plantation::create([
                'objectid' => $properties['objectid'] ?? null,
                'type' => $properties['type'] ?? null,
                'percent' => $properties['percent'] ?? null,
                'spec_1' => $properties['spec_1'] ?? null,
                'spec_2' => $properties['spec_2'] ?? null,
                'spec_3' => $properties['spec_3'] ?? null,
                'spec_4' => $properties['spec_4'] ?? null,
                'spec_5' => $properties['spec_5'] ?? null,
                'spec_simp' => $properties['spec_simp'] ?? null,
                'country' => $properties['country'] ?? null,
                'geometry' => json_encode($feature['geometry']),
            ]);
        }

        $this->command->info('Plantation data imported successfully!');
    }
}
