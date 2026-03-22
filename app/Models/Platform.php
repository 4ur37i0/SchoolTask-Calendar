<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Platform extends Model
{
    protected $fillable = [
        'url',
        'name',
        'type',//personal, moodle, google and so on
        'default_color'//color of the platform in rgb format
    ];
}
