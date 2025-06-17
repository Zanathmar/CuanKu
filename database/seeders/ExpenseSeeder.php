<?php

namespace Database\Seeders;

use App\Models\Expense;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class ExpenseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $expenses = [
            // Recent expenses (current month)
            [
                'title' => 'Groceries - Indomaret',
                'amount' => 750000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Gas Station - Pertamina',
                'amount' => 200000,
                'category' => 'Transportation',
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Coffee Shop - Starbucks',
                'amount' => 45000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Internet Bill - Indihome',
                'amount' => 300000,
                'category' => 'Bills & Utilities',
                'created_at' => Carbon::now()->subDays(4),
            ],
            [
                'title' => 'Movie Tickets - CGV',
                'amount' => 120000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Pharmacy - Kimia Farma',
                'amount' => 85000,
                'category' => 'Healthcare',
                'created_at' => Carbon::now()->subDays(6),
            ],
            [
                'title' => 'Lunch - Warteg',
                'amount' => 35000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subDays(7),
            ],
            [
                'title' => 'Grab Ride',
                'amount' => 25000,
                'category' => 'Transportation',
                'created_at' => Carbon::now()->subDays(8),
            ],
            [
                'title' => 'Mobile Credit - Telkomsel',
                'amount' => 50000,
                'category' => 'Bills & Utilities',
                'created_at' => Carbon::now()->subDays(9),
            ],
            [
                'title' => 'Bakso Dinner',
                'amount' => 40000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subDays(10),
            ],

            // Last month expenses
            [
                'title' => 'Electricity Bill - PLN',
                'amount' => 450000,
                'category' => 'Bills & Utilities',
                'created_at' => Carbon::now()->subMonth()->subDays(5),
            ],
            [
                'title' => 'Restaurant Dinner - Pizza Hut',
                'amount' => 320000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonth()->subDays(8),
            ],
            [
                'title' => 'Gym Membership - Celebrity Fitness',
                'amount' => 500000,
                'category' => 'Health & Fitness',
                'created_at' => Carbon::now()->subMonth()->subDays(10),
            ],
            [
                'title' => 'Online Shopping - Shopee',
                'amount' => 680000,
                'category' => 'Shopping',
                'created_at' => Carbon::now()->subMonth()->subDays(12),
            ],
            [
                'title' => 'Fuel - Shell',
                'amount' => 180000,
                'category' => 'Transportation',
                'created_at' => Carbon::now()->subMonth()->subDays(15),
            ],
            [
                'title' => 'Netflix Subscription',
                'amount' => 120000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subMonth()->subDays(18),
            ],
            [
                'title' => 'Haircut - Salon',
                'amount' => 75000,
                'category' => 'Personal Care',
                'created_at' => Carbon::now()->subMonth()->subDays(20),
            ],
            [
                'title' => 'Water Bill - PDAM',
                'amount' => 95000,
                'category' => 'Bills & Utilities',
                'created_at' => Carbon::now()->subMonth()->subDays(22),
            ],

            // 2 months ago
            [
                'title' => 'Car Maintenance - Toyota Service',
                'amount' => 850000,
                'category' => 'Transportation',
                'created_at' => Carbon::now()->subMonths(2)->subDays(3),
            ],
            [
                'title' => 'Supermarket - Carrefour',
                'amount' => 420000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonths(2)->subDays(7),
            ],
            [
                'title' => 'Book Purchase - Gramedia',
                'amount' => 250000,
                'category' => 'Education',
                'created_at' => Carbon::now()->subMonths(2)->subDays(10),
            ],
            [
                'title' => 'Fast Food - KFC',
                'amount' => 65000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonths(2)->subDays(12),
            ],
            [
                'title' => 'Spotify Premium',
                'amount' => 55000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subMonths(2)->subDays(15),
            ],

            // 3 months ago
            [
                'title' => 'Doctor Visit - RS Siloam',
                'amount' => 350000,
                'category' => 'Healthcare',
                'created_at' => Carbon::now()->subMonths(3)->subDays(5),
            ],
            [
                'title' => 'Clothing - Uniqlo',
                'amount' => 480000,
                'category' => 'Shopping',
                'created_at' => Carbon::now()->subMonths(3)->subDays(8),
            ],
            [
                'title' => 'Taxi - Blue Bird',
                'amount' => 85000,
                'category' => 'Transportation',
                'created_at' => Carbon::now()->subMonths(3)->subDays(12),
            ],
            [
                'title' => 'Ice Cream - Baskin Robbins',
                'amount' => 90000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonths(3)->subDays(18),
            ],

            // 4 months ago
            [
                'title' => 'Laptop Repair',
                'amount' => 650000,
                'category' => 'Technology',
                'created_at' => Carbon::now()->subMonths(4)->subDays(3),
            ],
            [
                'title' => 'Birthday Gift',
                'amount' => 200000,
                'category' => 'Gifts',
                'created_at' => Carbon::now()->subMonths(4)->subDays(10),
            ],
            [
                'title' => 'Hotel Stay - Traveloka',
                'amount' => 720000,
                'category' => 'Travel',
                'created_at' => Carbon::now()->subMonths(4)->subDays(15),
            ],

            // 5 months ago
            [
                'title' => 'Phone Bill - XL',
                'amount' => 120000,
                'category' => 'Bills & Utilities',
                'created_at' => Carbon::now()->subMonths(5)->subDays(2),
            ],
            [
                'title' => 'Grocery - Alfamart',
                'amount' => 280000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonths(5)->subDays(8),
            ],
            [
                'title' => 'Shoes - Adidas',
                'amount' => 890000,
                'category' => 'Shopping',
                'created_at' => Carbon::now()->subMonths(5)->subDays(12),
            ],

            // 6 months ago
            [
                'title' => 'Concert Ticket - Jakarta Fair',
                'amount' => 450000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subMonths(6)->subDays(5),
            ],
            [
                'title' => 'Dental Checkup',
                'amount' => 300000,
                'category' => 'Healthcare',
                'created_at' => Carbon::now()->subMonths(6)->subDays(10),
            ],
            [
                'title' => 'Food Delivery - GoFood',
                'amount' => 75000,
                'category' => 'Food & Dining',
                'created_at' => Carbon::now()->subMonths(6)->subDays(15),
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }
    }
}