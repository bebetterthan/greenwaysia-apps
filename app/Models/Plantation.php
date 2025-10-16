<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Plantation extends Model
{
    protected $fillable = [
        'objectid',
        'type',
        'percent',
        'spec_1',
        'spec_2',
        'spec_3',
        'spec_4',
        'spec_5',
        'spec_simp',
        'country',
        'geometry',
    ];

    protected $casts = [
        'geometry' => 'array',
        'percent' => 'decimal:2',
    ];
}
