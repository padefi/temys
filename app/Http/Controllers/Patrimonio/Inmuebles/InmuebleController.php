<?php

namespace App\Http\Controllers\Patrimonio\Inmuebles;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InmuebleController extends Controller
{
    public function index() {
        return Inertia::render('Patrimonio/Inmuebles/Inmueble', [
            'modulo' => 'patrimonio',
        ]);
    }
}
