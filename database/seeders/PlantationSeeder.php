<?php

namespace Database\Seeders;

use App\Models\Plantation;
use Illuminate\Database\Seeder;

class PlantationSeeder extends Seeder
{
    public function run(): void
    {
        // NOTE: Plantation GeoJSON data is loaded directly from frontend (maps.html)
        // Data is fetched from GitHub Release for better performance and smaller project size
        // No need to seed data into database as it's loaded dynamically in the frontend
        
        // Seeder skipped - Data loaded from frontend via GitHub Release
        
        /* ORIGINAL SEEDER CODE - Commented out for project size optimization
        $jsonPath = base_path('Perkebunan_indonesia.json');

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
        */
    }
}
