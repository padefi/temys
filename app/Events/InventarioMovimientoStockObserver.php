<?php

namespace App\Events;

use App\Models\Inventario\InventarioMovimientoStock;
use App\Models\Inventario\InventarioStock;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class InventarioMovimientoStockObserver
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct()
    {
        //
    }

     public function created(InventarioMovimientoStock $mov)
    {
        if ($mov->origen_id) {
            InventarioStock::updateOrCreate(
                ['producto_id' => $mov->producto_id, 'almacen_id' => $mov->origen_id],
                [
                    'cantidad_actual' => DB::raw('cantidad_actual - ' . $mov->cantidad),
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]
            );
        }

        if ($mov->destino_id) {
            InventarioStock::updateOrCreate(
                ['producto_id' => $mov->producto_id, 'almacen_id' => $mov->destino_id],
                [
                    'cantidad_actual' => DB::raw('cantidad_actual + ' . $mov->cantidad),
                    'usuario_actualizacion' => Auth::id(),
                    'fecha_actualizacion' => now(),
                ]
            );
        }
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('channel-name'),
        ];
    }
}
