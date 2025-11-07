<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventario_movimiento_estados', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transito_id');
            $table->enum('estado', ['pendiente', 'en_transito', 'completado', 'cancelado']);
            $table->unsignedBigInteger('usuario_id')->nullable();
            $table->timestamp('fecha')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->text('observacion')->nullable();

            // Relaciones
            $table->foreign('transito_id')->references('id')->on('inventario_stock_transito')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventario_movimiento_estados');
    }
};
