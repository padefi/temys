<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('bancos', function (Blueprint $table) {
            $table->id();
            $table->string('banco');
            $table->string('sucursal')->nullable();
            $table->string('codigo_sucursal')->nullable();
            $table->string('direccion')->nullable();
            $table->string('telefono')->nullable();
            $table->string('contacto')->nullable();
            $table->string('mail')->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('bancos');
    }
};

