<?php

namespace App\Models\ControlAcceso;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use App\Models\AjusteInventario;
use App\Models\Almacenes\Almacen;
use App\Models\Inventario\InventarioAjuste;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'last_name',
        'email',
        'password',
        'email_verified_at',
        'is_active',
        'reset_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function userRoles()
    {
        return $this->belongsToMany(Role::class, 'model_has_roles', 'model_id', 'role_id');
    }

    public function branches()
    {
        return $this->belongsToMany(Branch::class, 'model_has_branches', 'model_id', 'branch_id');
    }

    public function modules()
    {
        return $this->belongsToMany(Module::class, 'model_has_modules', 'model_id', 'module_id')->withPivot('branch_id');
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'model_has_menus', 'model_id', 'menu_id')->withPivot('branch_id');
    }

    public function submenus()
    {
        return $this->belongsToMany(Submenu::class, 'model_has_submenus', 'model_id', 'submenu_id')->withPivot('branch_id');
    }

    public function modulesRole()
    {
        return $this->belongsToMany(Module::class, 'model_has_module_role', 'model_id', 'module_id')->withPivot('role_id', 'branch_id');
    }

    public function modulePermissions()
    {
        return $this->belongsToMany(Module::class, 'model_has_module_permissions', 'model_id', 'module_id')->withPivot('permission_id', 'branch_id');
    }


    public function menuPermissions()
    {
        return $this->belongsToMany(Menu::class, 'model_has_menu_permissions', 'model_id', 'menu_id')->withPivot('permission_id', 'branch_id');
    }

    public function submenuPermissions()
    {
        return $this->belongsToMany(Submenu::class, 'model_has_submenu_permissions', 'model_id', 'submenu_id')->withPivot('permission_id', 'branch_id');
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'model_has_permissions', 'model_id', 'permission_id');
    }

    public static function moduleUsers(Module $module)
    {
        return User::whereHas('modules', function ($query) use ($module)
        {
            $query->where('modules.id', $module->id);
        })
            ->whereHas('userRoles', function ($query)
            {
                $query->where('name', '!=', 'admin');
            })
            ->get();
    }

    public function almacenesResponsables()
    {
        return $this->hasMany(Almacen::class, 'id_responsable');
    }

    public function almacenes()
    {
        return $this->belongsToMany(Almacen::class, 'relacion_almacen_user', 'user_id', 'almacen_id')->withTimestamps();
    }


    public function ajustesInventario()
{
    return $this->hasMany(InventarioAjuste::class, 'usuario_creacion');
}

}
