<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('padron_cbus', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['cliente', 'proveedor']);
            $table->unsignedBigInteger('tipo_id');

            $table->enum('tipo_clave', ['cbu', 'cvu']);
            $table->string('clave', 22); // CBU en Argentina tiene 22 dígitos
            $table->string('alias')->nullable(); // Alias CBU opcional
            $table->string('banco')->nullable(); // Nombre del banco
            $table->string('tipo_cuenta')->nullable(); // Caja de ahorro / cuenta corriente
            $table->boolean('predeterminado')->default(false);
            $table->timestamps();


            $table->index(['tipo', 'tipo_id']);

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padron_cbus');
    }
};
