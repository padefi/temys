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
        Schema::table('orden_compras', function (Blueprint $table) {
            $table->decimal('cotizacion_moneda', 15, 2)->nullable()->after('moneda_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orden_compras', function (Blueprint $table) {
            $table->dropColumn('cotizacion_moneda');
        });
    }
};
