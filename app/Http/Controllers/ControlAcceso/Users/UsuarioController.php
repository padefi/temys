<?php

namespace App\Http\Controllers\ControlAcceso\Users;

use App\Http\Controllers\Controller;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsuarioController extends Controller
{
    public function index()
    {
        $users = User::all();

        return Inertia::render('ControlAcceso/Usuarios', [
            'users' => $users,
        ]);
    }
}
