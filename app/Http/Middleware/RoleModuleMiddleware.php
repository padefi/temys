<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Middleware\ParseStringableParams;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Spatie\Permission\Models\Permission;
use Symfony\Component\HttpKernel\Exception\HttpException;

class RoleModuleMiddleware
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

        $hasRole = false;

        foreach ($dataParams as $dataParam)
        {
            $dataParam = trim($dataParam);
            if (!$dataParam) continue;

            [$roleName, $moduleKey] = explode(' ', $dataParam, 2);
            $module = Module::where('key', trim($moduleKey))->first();
            if (!$module) continue;

            $role = RoleModule::where('name', trim($roleName))->first();
            if (!$role) continue;

            $exists = DB::table('model_has_module_role')
                ->where('module_id', $module->id)
                ->where('role_id', $role->id)
                ->where('model_type', $user::class)
                ->where('model_id', $user->id)
                ->exists();

            if ($exists)
            {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole)
        {
            throw new HttpException(403, 'User does not have the role to the required action.', null, []);
        }

        return $next($request);
    }
}
