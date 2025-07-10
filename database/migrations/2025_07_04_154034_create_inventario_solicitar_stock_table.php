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
        Schema::create('inventario_solicitar_stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->unsignedBigInteger('almacen_solicitante_id');
            $table->unsignedBigInteger('almacen_proovedor_id');
            $table->integer('cantidad_solicitada');
            $table->enum('prioridad', ['Alta', 'Media', 'Baja','Urgente']);
            $table->string('motivo');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');


            //Relaciones

            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('almacen_solicitante_id')->references('id')->on('almacenes');
            $table->foreign('almacen_proovedor_id')->references('id')->on('almacenes');
            $table->foreign('usuario_creacion')->references('id')->on('users');

         
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_solicitar_stock');
    }
};
