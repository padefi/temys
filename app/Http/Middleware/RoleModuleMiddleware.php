<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Spatie\Permission\Exceptions\UnauthorizedException;
use App\Http\Middleware\ParseStringableParams;
use App\Models\ControlAcceso\Module;
use App\Models\ControlAcceso\RoleModule;

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

        if ($user->hasRole('admin')) return $next($request);

        $dataParams = explode('|', implode(' ', $params));

        $hasRole = false;

        foreach ($dataParams as $dataParam)
        {
            $dataParam = trim($dataParam);
            if (!$dataParam) continue;

            $parts = explode(' ', $dataParam, 2);
            $roleName = trim($parts[0]);
            $moduleKey = $parts[1] ?? null;

            $role = RoleModule::where('name', trim($roleName))->first();
            if (!$role) continue;

            $activeBranchId = session('active_branch_id');
            if (!$activeBranchId) continue;

            if ($moduleKey)
            {
                $module = Module::where('key', trim($moduleKey))->first();
                if (!$module) continue;

                $exists = DB::table('model_has_module_role')
                    ->where('module_id', $module->id)
                    ->where('role_id', $role->id)
                    ->where('model_type', $user::class)
                    ->where('model_id', $user->id)
                    ->where('branch_id', $activeBranchId)
                    ->exists();
            }
            else
            {
                $exists = DB::table('model_has_module_role')
                    ->where('role_id', $role->id)
                    ->where('model_type', $user::class)
                    ->where('model_id', $user->id)
                    ->where('branch_id', $activeBranchId)
                    ->exists();
            }

            if ($exists)
            {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole)
        {
            return Redirect::route('welcome')->with('flash', [
                'type' => 'error',
                'message' => 'No tiene el rol requerido.',
            ]);
            // throw new HttpException(403, 'User does not have the role to the required action.', null, []);
        }

        return $next($request);
    }
}
