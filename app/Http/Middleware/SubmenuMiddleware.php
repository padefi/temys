<?php

namespace App\Http\Middleware;

use App\Models\ControlAcceso\Submenu;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Exceptions\UnauthorizedException;
use Symfony\Component\HttpKernel\Exception\HttpException;
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
        $submenusIds = Submenu::whereIn('name', $submenus)->pluck('id');

        $hasSubmenu = DB::table('model_has_submenus')
            ->where('model_id', $user->id)
            ->where('model_type', $user::class)
            ->whereIn('submenu_id', $submenusIds)
            ->exists();

        if (!$hasSubmenu) {
            throw new HttpException(403, 'User does not have access to the required submenus.', null, []);
        }
        
        return $next($request);
    }
}
