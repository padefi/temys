<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'id',
        'key',
        'name',
        'guard_name',
        'created_at',
        'updated_at',
    ];
}
