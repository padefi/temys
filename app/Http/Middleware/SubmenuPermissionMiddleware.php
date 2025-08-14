<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Models\Permission;
use App\Http\Middleware\ParseStringableParams;
use App\Models\ControlAcceso\Submenu;

class SubmenuPermissionMiddleware
{
    use ParseStringableParams;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$menus
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$params)
    {
        if (!Auth::check())
        {
            throw UnauthorizedException::notLoggedIn();
        }

        $user = Auth::user();
        $dataParams = explode('|', implode(' ', $params));

        $hasPermission = false;

        foreach ($dataParams as $dataParam)
        {
            $dataParam = trim($dataParam);
            if (!$dataParam) continue;

            [$permissionName, $submenuKey] = explode(' ', $dataParam, 2);
            $submenu = Submenu::where('key', trim($submenuKey))->first();
            if (!$submenu) continue;

            $permission = Permission::where('name', trim($permissionName))->first();
            if (!$permission) continue;

            $activeBranchId = session('active_branch_id');
            if (!$activeBranchId) continue;

            $exists = DB::table('model_has_submenu_permissions')
                ->where('submenu_id', $submenu->id)
                ->where('permission_id', $permission->id)
                ->where('model_type', $user::class)
                ->where('model_id', $user->id)
                ->where('branch_id', $activeBranchId)
                ->exists();

            if ($exists)
            {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission)
        {
            throw new HttpException(403, 'No tiene permiso para realizar la acción requerida.', null, []);
            // throw new HttpException(403, 'User does not have permission to the required action.', null, []);
        }

        return $next($request);
    }
}
