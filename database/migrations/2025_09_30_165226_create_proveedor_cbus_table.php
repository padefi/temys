<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProveedorCbusTable extends Migration
{
    public function up(): void
    {
        Schema::create('proveedor_cbus', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proveedor_id');
            $table->string('cbu', 22); // CBU en Argentina tiene 22 dígitos
            $table->string('alias')->nullable(); // Alias CBU opcional
            $table->string('banco')->nullable(); // Nombre del banco
            $table->string('tipo_cuenta')->nullable(); // Caja de ahorro / cuenta corriente
            $table->boolean('predeterminado')->default(false);
            $table->timestamps();

            $table->foreign('proveedor_id')
                ->references('id')->on('proveedores')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proveedor_cbus');
    }
}

