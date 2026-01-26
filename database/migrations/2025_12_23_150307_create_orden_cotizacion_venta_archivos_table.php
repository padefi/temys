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
        Schema::create('orden_cotizacion_venta_archivos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('orden_cotizacion_ventas_id');

            $table->foreign(
                'orden_cotizacion_ventas_id',
                'fk_ocv_archivos_ocv'
            )
            ->references('id')
            ->on('orden_cotizaciones_ventas')
            ->onDelete('cascade');

            $table->string('nombre');
            $table->string('path');
            $table->string('mime')->nullable();
            $table->unsignedBigInteger('size')->nullable();

            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_cotizacion_venta_archivos');
    }
};
