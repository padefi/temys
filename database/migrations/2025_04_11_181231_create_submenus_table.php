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
        Schema::create('submenus', function (Blueprint $table) {
            $table->id();
            $table->string('key')->collation('utf8mb4_general_ci');
            $table->string('name')->collation('utf8mb4_general_ci');
            $table->string('guard_name')->collation('utf8mb4_general_ci');
            $table->timestamps();
        });

        Schema::create('menu_has_submenus', function (Blueprint $table)
        {
            $table->unsignedBigInteger('submenu_id');
            $table->unsignedBigInteger('menu_id');

            $table->foreign('submenu_id')
                ->references('id')
                ->on('submenus')
                ->onDelete('cascade');

            $table->foreign('menu_id')
                ->references('id')
                ->on('menus')
                ->onDelete('cascade');

            $table->primary(['submenu_id', 'menu_id'], 'menu_has_submenus_submenu_id_menu_id_primary');
        });

        Schema::create('model_has_submenus', function (Blueprint $table)
        {
            $table->unsignedBigInteger('submenu_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('submenu_id')
                ->references('id')
                ->on('submenus')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_submenus_model_id_model_type_index');
            $table->primary(['submenu_id', 'model_id', 'model_type'], 'model_has_submenus_submenu_model_type_primary');
        });

        /* Schema::create('model_has_submenu_permissions', function (Blueprint $table)
        {
            $table->unsignedBigInteger('submenu_id');
            $table->unsignedBigInteger('permission_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('submenu_id')
                ->references('id')
                ->on('submenus')
                ->onDelete('cascade');

            $table->foreign('permission_id')
                ->references('id')
                ->on('permissions')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_submenu_permission_model_id_model_type_index');
            $table->primary(['submenu_id', 'permission_id', 'model_id', 'model_type'], 'model_has_submenu_permissions_submenu_permission_model_type_primary');
        }); */
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('menu_has_submenus', function (Blueprint $table)
        {
            $table->dropForeign(['module_id']);
            $table->dropForeign(['role_id']);
        });

        Schema::table('model_has_submenus', function (Blueprint $table)
        {
            $table->dropForeign(['submenu_id']);
        });

        /* Schema::table('model_has_submenu_permissions', function (Blueprint $table)
        {
            $table->dropForeign(['submenu_id']);
            $table->dropForeign(['permission_id']);
        }); */

        Schema::dropIfExists('submenus');
        Schema::dropIfExists('menu_has_submenus');
        Schema::dropIfExists('model_has_submenus');
        // Schema::dropIfExists('model_has_submenu_permissions');
    }
};
