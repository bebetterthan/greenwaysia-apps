<?php

namespace Database\Seeders;

use App\Models\Admin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run(): void
    {
        Admin::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@greenesia.com',
            'password' => Hash::make('superadmin123'),
            'phone' => '08123456789',
            'address' => 'Jakarta, Indonesia',
            'role' => 'super_admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'name' => 'Admin Greenesia',
            'email' => 'admin@greenesia.com',
            'password' => Hash::make('admin123'),
            'phone' => '08987654321',
            'address' => 'Surabaya, Indonesia',
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        Admin::create([
            'name' => 'Editor Greenesia',
            'email' => 'editor@greenesia.com',
            'password' => Hash::make('editor123'),
            'phone' => '08567891234',
            'address' => 'Bandung, Indonesia',
            'role' => 'editor',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
