<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('orden_compras_archivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('orden_compra_id')
                  ->constrained('orden_compras')
                  ->onDelete('cascade'); // si se borra la orden, se borran sus archivos
            $table->string('nombre'); // nombre original
            $table->string('path');   // ruta en storage
            $table->string('mime')->nullable(); // tipo de archivo
            $table->unsignedBigInteger('size')->nullable(); // tamaño en bytes
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('orden_compras_archivos');
    }
};
