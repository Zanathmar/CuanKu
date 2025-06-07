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
            [
                'title' => 'Lunch at Restaurant',
                'amount' => 85000,
                'category' => 'Food',
                'created_at' => Carbon::now()->subDays(1),
            ],
            [
                'title' => 'Gas Station',
                'amount' => 150000,
                'category' => 'Transport',
                'created_at' => Carbon::now()->subDays(2),
            ],
            [
                'title' => 'Grocery Shopping',
                'amount' => 320000,
                'category' => 'Food',
                'created_at' => Carbon::now()->subDays(3),
            ],
            [
                'title' => 'Coffee',
                'amount' => 25000,
                'category' => 'Food',
                'created_at' => Carbon::now()->subDays(4),
            ],
            [
                'title' => 'Movie Tickets',
                'amount' => 120000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subDays(5),
            ],
            [
                'title' => 'Gym Membership',
                'amount' => 200000,
                'category' => 'Health',
                'created_at' => Carbon::now()->subDays(15),
            ],
            [
                'title' => 'Uber Ride',
                'amount' => 45000,
                'category' => 'Transport',
                'created_at' => Carbon::now()->subDays(28),
            ],
            [
                'title' => 'Clothes Shopping',
                'amount' => 450000,
                'category' => 'Shopping',
                'created_at' => Carbon::now()->subDays(20),
            ],
            [
                'title' => 'Medicine',
                'amount' => 75000,
                'category' => 'Health',
                'created_at' => Carbon::now()->subMonths(1),
            ],
            [
                'title' => 'Concert Ticket',
                'amount' => 300000,
                'category' => 'Entertainment',
                'created_at' => Carbon::now()->subMonths(2),
            ],
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }
    }
}