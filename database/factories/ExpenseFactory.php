<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expense>
 */
class ExpenseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'amount' => $this->faker->randomFloat(2, 1, 1000),
            'category' => $this->faker->randomElement(['Food', 'Transport', 'Entertainment', 'Health', 'Shopping', 'Other']),
            'created_at' => $this->faker->dateTimeBetween('-1 year', 'now'),
        ];
    }
}
