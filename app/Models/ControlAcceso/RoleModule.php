<?php

namespace App\Models\ControlAcceso;

use Exception;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Guard;
use Spatie\Permission\Models\Permission;

class RoleModule extends Model
{
    protected $fillable = [
        'name',
        'guard_name',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_module_permissions', 'role_id', 'permission_id');
    }

    public function syncPermissions($permissions)
    {
        // Si es una colección de modelos, conviértelo a IDs
        if ($permissions instanceof \Illuminate\Support\Collection)
        {
            $permissions = $permissions->pluck('id')->toArray();
        }

        // Si es un array de modelos, conviértelo a IDs
        if (is_array($permissions) && isset($permissions[0]) && $permissions[0] instanceof Permission)
        {
            $permissions = array_map(fn($p) => $p->id, $permissions);
        }

        $this->permissions()->sync($permissions);
    }

    public static function findById(int|string $id, ?string $guardName = null)
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);

        $role = static::findByParam([(new static)->getKeyName() => $id, 'guard_name' => $guardName]);

        if (! $role)
        {
            throw new Exception("There is no role with ID `{$id}` for guard `{$guardName}`.");
        }

        return $role;
    }

    public static function findByName(string $name, ?string $guardName = null)
    {
        $guardName = $guardName ?? Guard::getDefaultName(static::class);

        $role = static::findByParam(['name' => $name, 'guard_name' => $guardName]);

        if (! $role)
        {
            throw new Exception("There is no role with name `{$name}` for guard `{$guardName}`.");
        }

        return $role;
    }

    protected static function findByParam(array $params = [])
    {
        $query = static::query();

        foreach ($params as $key => $value)
        {
            $query->where($key, $value);
        }

        return $query->first();
    }
}
