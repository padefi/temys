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
        Schema::create('orden_venta_orden_cotizaciones', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('orden_ventas_id');
            $table->unsignedBigInteger('orden_cotizaciones_ventas_id');

            $table->timestamps();

            $table->foreign('orden_ventas_id', 'fk_ov_ocv_venta')
                ->references('id')
                ->on('orden_ventas')
                ->onDelete('cascade');

            $table->foreign('orden_cotizaciones_ventas_id', 'fk_ov_ocv_cotizacion')
                ->references('id')
                ->on('orden_cotizaciones_ventas')
                ->onDelete('cascade');

            $table->unique(
                ['orden_ventas_id', 'orden_cotizaciones_ventas_id'],
                'ux_ov_ocv'
            );
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_venta_orden_cotizaciones');
    }
};
