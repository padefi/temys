<?php

// database/migrations/2025_09_23_000001_create_tarjetas_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('tarjetas', function (Blueprint $table) {
            $table->id();
            $table->string('tipo'); // visa, mastercard, etc.
            $table->string('numero_tarjeta');
            $table->unsignedBigInteger('cuenta_bancaria_id')->nullable();
            $table->date('vencimiento')->nullable();
            $table->string('nombre_titular')->nullable();
            $table->string('cuenta')->nullable();
            $table->timestamps();

            $table->foreign('cuenta_bancaria_id')
                    ->references('id')
                    ->on('cuenta_bancarias')
                    ->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('tarjetas');
    }
};

