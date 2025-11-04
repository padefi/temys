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
        Schema::create('inventario_stock_transito', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movimiento_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad');
            $table->enum('estado', ['pendiente', 'en_transito', 'en_ruta', 'recibido', 'cancelado']);
            $table->string('ubicacion_actual')->nullable();
            $table->timestamp('fecha_salida')->default(now());
            $table->unsignedBigInteger('usuario_id');
            $table->timestamps();

            // Relaciones
            $table->foreign('movimiento_id')->references('id')->on('inventario_movimiento_stocks')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('users');
            $table->foreign('producto_id')->references('id')->on('productos')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_movimiento_estados');
    }
};
