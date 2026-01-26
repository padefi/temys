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
       Schema::create('orden_cotizaciones_ventas_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_cotizaciones_ventas_id');
            $table->unsignedBigInteger('producto_id');
            $table->date('entrega_esperada')->nullable();
            $table->string('descripcion');
            $table->string('codigo_barras');
            $table->string('referencia');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('porcentaje_descuento', 10, 2);
            $table->decimal('importe', 10, 2);
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            $table->timestamps();


            $table->foreign('usuario_id')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_cotizaciones_ventas_detalles');
    }
};
