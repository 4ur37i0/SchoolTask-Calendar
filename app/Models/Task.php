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

    //relationships for user and platform
    public function user()
{
    return $this->belongsTo(User::class);
}

    public function platform()
{
    return $this->belongsTo(Platform::class);
}
}
