<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('inventario_movimiento_stocks', function (Blueprint $table) {
            $table->enum('estado_movimiento', ['pendiente', 'en_transito', 'finalizado'])
                ->default('pendiente')
                ->after('cantidad');
 


            $table->enum('tipo_movimiento', ['recepcion', 'transferencia', 'venta', 'ajuste', 'devolucion', 'orden_compra', 'orden_entrega', 'reposicion'])
                ->nullable()
                ->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventario_movimiento_stocks', function (Blueprint $table) {
            $table->dropColumn(['estado_movimiento', 'tipo_movimiento']);
        });
    }
};
