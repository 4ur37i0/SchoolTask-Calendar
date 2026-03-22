<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPlatform extends Model
{
    protected $table = 'users_platforms'; //table name in the db (needed bc of the naming convention of the pivot table)

    protected $fillable = [
        'user_id',
        'platform_id',
        'token',
    ];

    //relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function platform()
    {
        return $this->belongsTo(Platform::class);
    }
}
