<?php

namespace App\Http\Controllers\Compras;

use App\Http\Controllers\Controller;
//use App\Http\Resources\ControlAcceso\ModuleResource;
use App\Models\Padron\Proveedor\Proveedor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ComprasController extends Controller
{
    public function index()
    {
        return Inertia::render('Compras/Dashboard/Index');
    }


}
