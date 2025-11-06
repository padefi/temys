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
        Schema::create('co_saldo_cuentas', function (Blueprint $table)
        {
            $table->id();
            $table->unsignedBigInteger('co_cuenta_id');
            $table->unsignedBigInteger('co_ejercicio_id');
            $table->decimal('debe', 20, 2);
            $table->decimal('haber', 20, 2);
            $table->decimal('saldo', 20, 2);

            $table->foreign('co_cuenta_id')
                ->references('id')
                ->on('co_cuentas')
                ->onDelete('cascade');

            $table->foreign('co_ejercicio_id')
                ->references('id')
                ->on('co_ejercicios')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('co_saldo_cuentas', function (Blueprint $table)
        {
            $table->dropForeign(['co_cuenta_id']);
            $table->dropForeign(['co_ejercicio_id']);
        });
    }
};
