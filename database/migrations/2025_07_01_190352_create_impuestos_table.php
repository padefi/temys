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
        Schema::create('impuestos', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion');
            $table->decimal('porcentaje', 5, 2);
            $table->unsignedBigInteger('co_cuenta_id');
            $table->foreign('co_cuenta_id')
                ->references('id')
                ->on('co_cuentas')
                ->onDelete('cascade');
            $table->boolean('habilitado')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('impuestos');
    }
};
