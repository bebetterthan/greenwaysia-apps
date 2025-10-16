<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mangrove extends Model
{
    protected $fillable = [
        'resolution',
        'geometry',
        'properties',
    ];

    protected $casts = [
        'geometry' => 'array',
        'properties' => 'array',
    ];
}
