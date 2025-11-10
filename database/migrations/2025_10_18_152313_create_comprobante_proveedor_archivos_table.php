<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('comprobante_proveedor_archivos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('comprobante_proveedor_id')
                  ->constrained('comprobantes_proveedores')
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
        Schema::dropIfExists('comprobante_proveedor_archivos');
    }
};
