<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Izzan',
            'email' => 'izzanathmar.m@gmail.com',
            'password' => bcrypt('12345678'),
        ]);
        $this->call([
            ExpenseSeeder::class,
            IncomeSeeder::class
        ]);
    }
}
