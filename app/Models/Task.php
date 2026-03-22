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
        //fields added bc of personal tasks
        'description',
        'source',
        'priority',
        'user_id',
        'platform_id',
    ];
}
