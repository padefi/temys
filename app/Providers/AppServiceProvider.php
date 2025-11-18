<?php

namespace App\Providers;

use App\Events\InventarioMovimientoStockObserver;
use App\Models\Inventario\InventarioMovimientoStock;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        InventarioMovimientoStock::observe(InventarioMovimientoStockObserver::class);
        Vite::prefetch(concurrency: 3);
    }
}
