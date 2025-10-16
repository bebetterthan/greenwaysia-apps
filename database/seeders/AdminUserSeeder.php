<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create main admin user
        User::create([
            'name' => 'Admin Greenesia',
            'email' => 'admin@greenesia.com',
            'password' => Hash::make('password123'),
            'phone' => '08123456789',
            'address' => 'Jakarta, Indonesia',
            'email_verified_at' => now(),
        ]);

        // Create super admin user
        User::create([
            'name' => 'Super Admin',
            'email' => 'superadmin@greenesia.com',
            'password' => Hash::make('superadmin123'),
            'phone' => '08987654321',
            'address' => 'Surabaya, Indonesia',
            'email_verified_at' => now(),
        ]);

        // You can add more admin users here
        // User::create([...]);
    }
}
