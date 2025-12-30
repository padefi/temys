<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migración de provincias con nombres de columnas idénticos al CSV de Georef
     * 
     * CSV: categoria, centroide_lat, centroide_lon, fuente, id, iso_id, iso_nombre, nombre, nombre_completo
     */
    public function up(): void
    {
        Schema::create('georef_provincias', function (Blueprint $table) {
            // Columnas exactamente como en el CSV de Georef
            $table->string('categoria', 50)->nullable();
            $table->decimal('centroide_lat', 10, 7)->nullable();
            $table->decimal('centroide_lon', 10, 7)->nullable();
            $table->string('fuente', 50)->nullable();
            $table->string('id', 10)->primary()->comment('ID oficial de Georef');
            $table->string('iso_id', 10)->nullable();
            $table->string('iso_nombre', 150)->nullable();
            $table->string('nombre', 100);
            $table->string('nombre_completo', 150)->nullable();
            
            $table->timestamps();
            
            // Índices para búsqueda rápida
            $table->index('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('georef_provincias');
    }
};
