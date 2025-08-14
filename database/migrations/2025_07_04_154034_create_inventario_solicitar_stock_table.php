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
            $table->unsignedBigInteger('almacen_solicitante_id');
            $table->unsignedBigInteger('almacen_proveedor_id');
            $table->enum('prioridad', ['Alta', 'Media', 'Baja']);
            $table->enum('estado',['Pendiente','Aceptada','Cancelada']);
            $table->string('motivo');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->timestamp('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();


            //Relaciones            
            $table->foreign('almacen_solicitante_id')->references('id')->on('almacenes');
            $table->foreign('almacen_proveedor_id')->references('id')->on('almacenes');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

         
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_solicitar_stocks');
    }
};
