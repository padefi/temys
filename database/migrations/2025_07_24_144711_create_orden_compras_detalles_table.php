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
        Schema::create('orden_compras_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_compras_id');
            $table->unsignedBigInteger('orden_cotizaciones_id')->nullable();
            $table->unsignedBigInteger('producto_id');
            $table->date('entrega_esperada')->nullable();
            $table->string('descripcion');
            $table->integer('cantidad');
            $table->decimal('precio_unitario', 10, 2);
            $table->decimal('porcentaje_descuento', 10, 2);
            $table->decimal('importe', 10, 2);
            $table->unsignedBigInteger('co_cuenta_id')->nullable();
            $table->unsignedBigInteger('usuario_creacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            $table->timestamps();



             //Relaciones

            $table->foreign('orden_compras_id')->references('id')->on('orden_compras');
            $table->foreign('orden_cotizaciones_id')->references('id')->on('orden_cotizaciones');
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
            $table->foreign('co_cuenta_id')->references('id')->on('co_cuentas')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compras_detalles');
    }
};
