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
         Schema::create('orden_venta_comprobante', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_venta_id');
            $table->unsignedBigInteger('comprobante_id');
            $table->timestamps();

            $table->foreign('orden_venta_id')
                ->references('id')
                ->on('orden_ventas')
                ->onDelete('cascade');

            $table->foreign('comprobante_id')
                ->references('id')
                ->on('comprobantes_clientes')
                ->onDelete('cascade');

            $table->unique(['orden_venta_id', 'comprobante_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_venta_comprobante');
    }
};
