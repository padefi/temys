<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventario_stock_transito', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movimiento_id');
            $table->unsignedBigInteger('producto_id');
            $table->unsignedBigInteger('origen_id');
            $table->unsignedBigInteger('destino_id');
            $table->integer('cantidad');
            $table->enum('estado', ['pendiente', 'en_transito', 'recibido', 'cancelado'])->default('pendiente');
            $table->string('ubicacion_actual')->nullable();
            $table->timestamp('fecha_salida')->nullable();
            $table->timestamp('fecha_llegada')->nullable();
            $table->text('observaciones')->nullable();

            // Relaciones
            $table->foreign('movimiento_id')->references('id')->on('inventario_movimiento_stocks')->onDelete('cascade');
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('origen_id')->references('id')->on('almacenes');
            $table->foreign('destino_id')->references('id')->on('almacenes');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventario_stock_transito');
    }
};
