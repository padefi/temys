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
        Schema::create('menus', function (Blueprint $table)
        {
            $table->id();
            $table->string('name')->collation('utf8mb4_general_ci');
            $table->timestamps();
        });

        Schema::create('module_has_menus', function (Blueprint $table)
        {
            $table->unsignedBigInteger('menu_id');
            $table->unsignedBigInteger('module_id');

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onDelete('cascade');

            $table->foreign('module_id')
                ->references('id')
                ->on('modules')
                ->onDelete('cascade');

            $table->primary(['menu_id', 'module_id'], 'module_has_menus_menu_id_module_id_primary');
        });

        Schema::create('model_has_menus', function (Blueprint $table)
        {
            $table->unsignedBigInteger('menu_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_menus_model_id_model_type_index');
            $table->primary(['menu_id', 'model_id', 'model_type'], 'model_has_menus_menu_model_type_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('module_has_menus', function (Blueprint $table)
        {
            $table->dropForeign(['menu_id']);
            $table->dropForeign(['module_id']);
        });

        Schema::table('model_has_menus', function (Blueprint $table)
        {
            $table->dropForeign(['menu_id']);
        });

        Schema::dropIfExists('menus');
        Schema::dropIfExists('module_has_menus');
        Schema::dropIfExists('model_has_menus');
    }
};