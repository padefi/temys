<?php

namespace App\Http\Controllers\ControlAcceso\Users;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\ControlAcceso\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccessController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $modules = Module::query()
            ->whereHas('users', function ($query) use ($user) {
                $query->where('model_id', $user->id);
            })
            ->with(['menus' => function ($query) use ($user) {
                $query->whereHas('users', function ($q) use ($user) {
                    $q->where('model_id', $user->id);
                })
                ->with(['submenus' => function ($q) use ($user) {
                    $q->whereHas('users', function ($sq) use ($user) {
                        $sq->where('model_id', $user->id);
                    });
                }]);
            }])
            ->get();

        return Inertia::render('Dashboard', [
            'modules' => ModuleResource::collection($modules),
        ]);
    }
}
