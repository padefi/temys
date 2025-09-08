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
        Schema::create('saldo_subcuentas', function (Blueprint $table)
        {
            $table->id();
            $table->unsignedBigInteger('subcuenta_id');
            $table->unsignedBigInteger('ejercicio_id');
            $table->decimal('debe', 20, 2);
            $table->decimal('haber', 20, 2);
            $table->decimal('saldo', 20, 2);

            $table->foreign('subcuenta_id')
                ->references('id')
                ->on('subcuentas')
                ->onDelete('cascade');

            $table->foreign('ejercicio_id')
                ->references('id')
                ->on('ejercicios')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('saldo_subcuentas', function (Blueprint $table)
        {
            $table->dropForeign(['subcuenta_id']);
            $table->dropForeign(['ejercicio_id']);
        });
    }
};
