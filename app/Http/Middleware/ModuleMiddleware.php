<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use App\Models\ControlAcceso\Module;
use App\Http\Middleware\ParseStringableParams;

class ModuleMiddleware
{
    use ParseStringableParams;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$modules
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$params)
    {
        if (!Auth::check()) {
            throw UnauthorizedException::notLoggedIn();
        }

        $user = Auth::user();
        $modules = explode('|', self::parseStringableParam($params));
        $moduleIds = Module::whereIn('key', $modules)->pluck('id');
        $activeBranchId = session('active_branch_id');

        $hasModule = DB::table('model_has_modules')
            ->where('model_id', $user->id)
            ->where('model_type', $user::class)
            ->whereIn('module_id', $moduleIds)
            ->where('branch_id', $activeBranchId)
            ->exists();

        if (!$hasModule) {
            return Redirect::route('welcome')->with('flash', [
                'type' => 'error',
                'message' => 'No tiene acceso al módulo indicado.',
            ]);
            // throw new HttpException(403, 'User does not have access to the required modules.', null, []);
        }
        
        return $next($request);
    }
}
