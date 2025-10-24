<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    protected $fillable = [
        'course',
        'title',
        'due_date',
        'status',
        'color_rgb'
    ];
}
