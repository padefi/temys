<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->unsignedBigInteger('co_cuenta_id')->nullable()->after('usuario_actualizacion');

            $table->foreign('co_cuenta_id')
                  ->references('id')
                  ->on('co_cuentas')
                  ->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('productos', function (Blueprint $table) {
            $table->dropForeign(['co_cuenta_id']);
            $table->dropColumn('co_cuenta_id');
        });
    }
};
