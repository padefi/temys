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
        Schema::create('orden_tesoreria_pago_transferencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_tesoreria_id');
            $table->foreign('orden_tesoreria_id')
                ->references('id')
                ->on('orden_tesoreria')
                ->onDelete('cascade');

            $table->unsignedBigInteger('cuenta_bancaria_origen_id');
            $table->foreign('cuenta_bancaria_origen_id')
                ->references('id')
                ->on('cuenta_bancarias')
                ->onDelete('cascade')->name('fk_cuenta_bancaria');;

            $table->enum('tipo', ['cliente', 'proveedor']);


            $table->unsignedBigInteger('cbu_id');
            $table->foreign('cbu_id')
                ->references('id')
                ->on('padron_cbus')
                ->onDelete('cascade');


            $table->string('numero_operacion')->nullable();

            $table->unsignedBigInteger('usuario_creacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_tesoreria_pago_transferencias');
    }
};
