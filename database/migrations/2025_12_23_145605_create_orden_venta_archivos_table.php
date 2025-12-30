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
        Schema::create('orden_venta_archivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orden_venta_id')
                  ->constrained('orden_ventas')
                  ->onDelete('cascade'); // si se borra la orden, se borran sus archivos
            $table->string('nombre'); // nombre original
            $table->string('path');   // ruta en storage
            $table->string('mime')->nullable(); // tipo de archivo
            $table->unsignedBigInteger('size')->nullable(); // tamaño en bytes
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_venta_archivos');
    }
};
