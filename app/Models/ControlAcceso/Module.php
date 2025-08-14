<?php

namespace App\Models\ControlAcceso;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class Module extends Model
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
        return $this->belongsToMany(Menu::class, 'module_has_menus', 'module_id', 'menu_id')->orderBy('name');
    }

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'model_has_modules', 'module_id', 'model_id')->withPivot('branch_id');
    }

    public function roleModule(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'role_has_modules', 'module_id', 'role_id')->withPivot('branch_id');
    }

    public function userPermissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'model_has_module_permissions', 'module_id', 'permission_id')->withPivot('branch_id');
    }
}
