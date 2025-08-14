<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Spatie\Permission\Exceptions\UnauthorizedException;
use App\Models\ControlAcceso\Menu;
use App\Http\Middleware\ParseStringableParams;

class MenuMiddleware
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
        if (!Auth::check()) {
            throw UnauthorizedException::notLoggedIn();
        }

        $user = Auth::user();
        $menus = explode('|', self::parseStringableParam($params));
        $menusIds = Menu::whereIn('key', $menus)->pluck('id');
        $activeBranchId = session('active_branch_id');

        $hasMenu = DB::table('model_has_menus')
            ->where('model_id', $user->id)
            ->where('model_type', $user::class)
            ->whereIn('menu_id', $menusIds)
            ->where('branch_id', $activeBranchId)
            ->exists();

        if (!$hasMenu) {
            return Redirect::route('welcome')->with('flash', [
                'type' => 'error',
                'message' => 'No tiene acceso al menú indicado.',
            ]);
            // throw new HttpException(403, 'User does not have access to the required menus.', null, []);
        }
        
        return $next($request);
    }
}
