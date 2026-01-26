<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\User::firstOrCreate(  // ← usa namespace completo aquí
            ['email' => 'admin@cine.com'],
            [
                'name'     => 'Admin Cine',
                'password' => Hash::make('password123'),
                'role'     => 'admin',
            ]
        );

        \App\Models\User::firstOrCreate(
            ['email' => 'empleado@cine.com'],
            [
                'name'     => 'Empleado Taquilla',
                'password' => Hash::make('password123'),
                'role'     => 'empleado',
            ]
        );

        $this->command->info('Usuarios verificados/creados:');
        $this->command->info('- Admin: admin@cine.com / password123');
        $this->command->info('- Empleado: empleado@cine.com / password123');
    }
}