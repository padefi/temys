<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Menu extends Model
{
    protected $fillable = [
        'id',
        'key',
        'name',
        'guard_name',
        'created_at',
        'updated_at',
    ];

    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'module_has_menus', 'menu_id', 'module_id');
    }

    public function submenus(): BelongsToMany
    {
        return $this->belongsToMany(Submenu::class, 'menu_has_submenus', 'menu_id', 'submenu_id');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'model_has_menus', 'menu_id', 'model_id');
    }
}
