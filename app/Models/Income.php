<?php
// First, make sure you have the Income model
// app/Models/Income.php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Income extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];
}
