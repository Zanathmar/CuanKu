<?php

namespace Database\Seeders;

use App\Models\Income;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class IncomeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $incomes = [
            // Current month
            [
                'title' => 'Monthly Salary - June',
                'amount' => 8500000,
                'created_at' => Carbon::now()->startOfMonth(),
            ],
            [
                'title' => 'Freelance Project - Web Development',
                'amount' => 1200000,
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Bonus - Performance',
                'amount' => 500000,
                'created_at' => Carbon::now()->subDays(10),
            ],

            // Last month (May)
            [
                'title' => 'Monthly Salary - May',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonth()->startOfMonth(),
            ],
            [
                'title' => 'Side Project - Mobile App',
                'amount' => 2000000,
                'created_at' => Carbon::now()->subMonth()->subDays(8),
            ],
            [
                'title' => 'Dividend - Investment',
                'amount' => 300000,
                'created_at' => Carbon::now()->subMonth()->subDays(15),
            ],

            // 2 months ago (April)
            [
                'title' => 'Monthly Salary - April',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonths(2)->startOfMonth(),
            ],
            [
                'title' => 'Freelance Design Project',
                'amount' => 800000,
                'created_at' => Carbon::now()->subMonths(2)->subDays(12),
            ],
            [
                'title' => 'Cashback - Credit Card',
                'amount' => 150000,
                'created_at' => Carbon::now()->subMonths(2)->subDays(20),
            ],

            // 3 months ago (March)
            [
                'title' => 'Monthly Salary - March',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonths(3)->startOfMonth(),
            ],
            [
                'title' => 'Consulting Fee',
                'amount' => 1500000,
                'created_at' => Carbon::now()->subMonths(3)->subDays(10),
            ],
            [
                'title' => 'Investment Return',
                'amount' => 400000,
                'created_at' => Carbon::now()->subMonths(3)->subDays(18),
            ],

            // 4 months ago (February)
            [
                'title' => 'Monthly Salary - February',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonths(4)->startOfMonth(),
            ],
            [
                'title' => 'Annual Bonus',
                'amount' => 5000000,
                'created_at' => Carbon::now()->subMonths(4)->subDays(5),
            ],
            [
                'title' => 'Online Course Sales',
                'amount' => 750000,
                'created_at' => Carbon::now()->subMonths(4)->subDays(12),
            ],

            // 5 months ago (January)
            [
                'title' => 'Monthly Salary - January',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonths(5)->startOfMonth(),
            ],
            [
                'title' => 'Freelance Writing',
                'amount' => 600000,
                'created_at' => Carbon::now()->subMonths(5)->subDays(8),
            ],
            [
                'title' => 'Referral Bonus',
                'amount' => 250000,
                'created_at' => Carbon::now()->subMonths(5)->subDays(15),
            ],

            // 6 months ago (December)
            [
                'title' => 'Monthly Salary - December',
                'amount' => 8500000,
                'created_at' => Carbon::now()->subMonths(6)->startOfMonth(),
            ],
            [
                'title' => 'Year-end Bonus',
                'amount' => 2500000,
                'created_at' => Carbon::now()->subMonths(6)->subDays(10),
            ],
            [
                'title' => 'Holiday Allowance',
                'amount' => 1000000,
                'created_at' => Carbon::now()->subMonths(6)->subDays(20),
            ],
        ];

        foreach ($incomes as $income) {
            Income::create($income);
        }
    }
}