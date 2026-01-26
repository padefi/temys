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
        Schema::create('solicitud_venta_orden_cotizaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('solicitud_venta_id');
            $table->unsignedBigInteger('orden_cotizaciones_id');
            $table->timestamps();

            $table->foreign('solicitud_venta_id', 'fk_solicitud_venta')
                ->references('id')->on('solicitud_ventas')
                ->onDelete('cascade');

            $table->foreign('orden_cotizaciones_id', 'fk_orden_cotizaciones_ventas')
                ->references('id')->on('orden_cotizaciones_ventas')
                ->onDelete('cascade');

            $table->unique(
                ['solicitud_venta_id', 'orden_cotizaciones_id'],
                'solicitud_orden_unique'
            );

        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitud_venta_orden_cotizacion');
    }
};
