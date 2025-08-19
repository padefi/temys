<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission;

class Submenu extends Model
{
    protected $fillable = [
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
        return $this->belongsToMany(User::class, 'model_has_submenus', 'submenu_id', 'model_id')->withPivot('branch_id');
    }

    public function userPermissions()
    {
        return $this->belongsToMany(Permission::class, 'model_has_submenu_permissions', 'submenu_id', 'permission_id')->withPivot('branch_id');
    }
}
