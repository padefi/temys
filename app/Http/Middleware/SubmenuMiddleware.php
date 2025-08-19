<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use App\Models\ControlAcceso\Submenu;
use App\Http\Middleware\ParseStringableParams;

class SubmenuMiddleware
{
    use ParseStringableParams;
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$submenus
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next, string ...$params)
    {
        if (!Auth::check()) {
            throw UnauthorizedException::notLoggedIn();
        }

        $user = Auth::user();
        $submenus = explode('|', self::parseStringableParam($params));
        $submenusIds = Submenu::whereIn('key', $submenus)->pluck('id');
        $activeBranchId = session('active_branch_id');

        $hasSubmenu = DB::table('model_has_submenus')
            ->where('model_id', $user->id)
            ->where('model_type', $user::class)
            ->whereIn('submenu_id', $submenusIds)
            ->where('branch_id', $activeBranchId)
            ->exists();

        if (!$hasSubmenu) {
            return Redirect::route('welcome')->with('flash', [
                'type' => 'error',
                'message' => 'No tiene acceso al submenú indicado.',
            ]);
            // throw new HttpException(403, 'User does not have access to the required submenus.', null, []);
        }
        
        return $next($request);
    }
}
