<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Submenu extends Model
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
        return $this->belongsToMany(Menu::class, 'menu_has_submenus', 'submenu_id', 'menu_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'model_has_submenus', 'submenu_id', 'model_id');
    }
}
