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
        Schema::create('inmueble_contacto', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inmuebles_id');
            $table->unsignedBigInteger('inmuebles_tipo_contacto_id');                 
            $table->string('contacto')->nullable();
            $table->string('descripcion')->nullable();

         
            //Relaciones
            $table->foreign('inmuebles_id')->references('id')->on('inmuebles');
            $table->foreign('inmuebles_tipo_contacto_id')->references('id')->on('inmueble_tipo_contacto');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inmueble_contacto');
    }
};
