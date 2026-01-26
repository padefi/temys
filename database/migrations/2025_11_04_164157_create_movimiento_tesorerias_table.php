<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('movimientos_tesoreria', function (Blueprint $table) {
            $table->id();
            $table->date('fecha_movimiento');
            $table->date('fecha_aplicacion'); //fecha que le asigna tesorería
            $table->enum('tipo_movimiento', ['entrada', 'salida']);
            $table->decimal('monto', 15, 2);

            $table->enum('tipo', ['cliente', 'proveedor']);

            $table->unsignedBigInteger('tipo_id');

            $table->unsignedBigInteger('metodo_id');
            $table->foreign('metodo_id')->references('id')->on('metodo_tesoreria');

            $table->unsignedBigInteger('tipo_moneda_id');
            $table->foreign('tipo_moneda_id')
                ->references('id')
                ->on('tipo_monedas')
                ->onDelete('cascade');

            $table->unsignedBigInteger('banco_id')->nullable();
            $table->foreign('banco_id')
                ->references('id')
                ->on('bancos')
                ->onDelete('cascade');

            $table->unsignedBigInteger('cuenta_bancaria_id')->nullable();
            $table->foreign('cuenta_bancaria_id')
                ->references('id')
                ->on('cuenta_bancarias')
                ->onDelete('cascade');

            $table->unsignedBigInteger('orden_id')->nullable();
            $table->foreign('orden_id')
                ->references('id')
                ->on('orden_tesoreria')
                ->onDelete('cascade');



            $table->unsignedBigInteger('usuario_id');
            $table->foreign('usuario_id')
                ->nullable()
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->string('descripcion')->nullable();
            $table->string('referencia_bancaria')->nullable();
            $table->boolean('conciliado')->default(false);
            $table->date('fecha_conciliado')->nullable();

            $table->unsignedBigInteger('usuario_conciliado_id')->nullable();
            $table->foreign('usuario_conciliado_id')
                ->nullable()
                ->references('id')
                ->on('users')
                ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('movimientos_tesoreria');
    }
};
