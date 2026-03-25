<?php

namespace App\Providers;

use App\Events\InventarioMovimientoStockObserver;
use App\Models\Inventario\InventarioMovimientoStock;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        InventarioMovimientoStock::observe(InventarioMovimientoStockObserver::class);
        Vite::prefetch(concurrency: 3);
        Relation::morphMap([
        'Proveedor' => \App\Models\Padron\Proveedor\Proveedor::class,
        'Cliente'   => \App\Models\Padron\Cliente\Cliente::class,
        ]);
    }
}
