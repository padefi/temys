<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_proveedor_actividad', function (Blueprint $table) {
            $table->unsignedBigInteger('id_actividad');
            $table->unsignedBigInteger('id_proveedor');
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');

            //Clave primaria compuesta
            $table->primary(['id_actividad', 'id_proveedor']);

            //Relaciones
            $table->foreign('id_actividad')->references('id')->on('actividades_economicas_proveedores')->onDelete('cascade');
            $table->foreign('id_proveedor')->references('id')->on('proveedores')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_proveedor_actividad');
    }
};
