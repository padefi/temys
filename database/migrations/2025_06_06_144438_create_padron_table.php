<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('padron', function (Blueprint $table) {
            $table->id(); // Esto crea un bigint autoincremental como primary key
            $table->enum('tipo_documento', ['DNI', 'Pasaporte', 'Cédula', 'LC', 'LE', 'CUIT', 'CUIL']);
            $table->string('documento', 20);
            $table->string('nacionalidad', 100)->nullable();
            $table->timestamps(); // Opcional: created_at y updated_at
        });
    }

    public function down()
    {
        Schema::dropIfExists('padron');
    }
};
