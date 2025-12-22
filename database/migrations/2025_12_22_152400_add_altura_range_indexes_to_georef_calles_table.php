<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('georef_calles', function (Blueprint $table) {
            if (!Schema::hasColumn('georef_calles', 'altura_min')) {
                $table->unsignedInteger('altura_min')->nullable()->after('altura_inicio_izquierda');
            }
            if (!Schema::hasColumn('georef_calles', 'altura_max')) {
                $table->unsignedInteger('altura_max')->nullable()->after('altura_min');
            }

            $table->index(['provincia_id', 'localidad_censal_id'], 'georef_calles_prov_locc_idx');
            $table->index(['provincia_id', 'localidad_id'], 'georef_calles_prov_loc_idx');
            $table->index(['provincia_id', 'localidad_censal_id', 'altura_min', 'altura_max'], 'georef_calles_prov_locc_altura_range_idx');
            $table->index(['provincia_id', 'localidad_id', 'altura_min', 'altura_max'], 'georef_calles_prov_loc_altura_range_idx');
        });
    }

    public function down(): void
    {
        Schema::table('georef_calles', function (Blueprint $table) {
            $table->dropIndex('georef_calles_prov_locc_altura_range_idx');
            $table->dropIndex('georef_calles_prov_loc_altura_range_idx');
            $table->dropIndex('georef_calles_prov_locc_idx');
            $table->dropIndex('georef_calles_prov_loc_idx');

            if (Schema::hasColumn('georef_calles', 'altura_max')) {
                $table->dropColumn('altura_max');
            }
            if (Schema::hasColumn('georef_calles', 'altura_min')) {
                $table->dropColumn('altura_min');
            }
        });
    }
};
