<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function menus(): BelongsToMany
    {
        return $this->belongsToMany(Menu::class, 'module_has_menus', 'module_id', 'menu_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class,'model_has_modules','module_id','model_id');
    }
}
