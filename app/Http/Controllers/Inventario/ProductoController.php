<?php

namespace App\Http\Controllers\inventario;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductoController extends Controller
{
   public function index(Request $request){
            return Inertia::render('Inventario/StockPage', [
           
        ]);
   }
}
