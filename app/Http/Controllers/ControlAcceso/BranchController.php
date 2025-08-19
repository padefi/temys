<?php

namespace App\Http\Controllers\ControlAcceso;

use App\Http\Controllers\Controller;
use App\Http\Resources\ControlAcceso\BranchResource;
use App\Models\ControlAcceso\Branch;
use App\Models\ControlAcceso\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BranchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $branches = Branch::all();

        return BranchResource::collection($branches);
    }

    public function showBranchesByUser(User $user)
    {
        $branches = Branch::leftJoin('model_has_branches', function ($join) use ($user)
        {
            $join->on('branches.id', '=', 'model_has_branches.branch_id')
                ->where('model_has_branches.model_id', '=', $user->id);
        })
            ->select('branches.*', DB::raw('IF(model_has_branches.branch_id IS NOT NULL, true, false) as is_assigned')) // Verifica si la sucursal estaba asignado al usuario
            ->where('branches.status', 'active')
            ->orderBy('branches.name', 'asc')
            ->get();

        return BranchResource::collection($branches);
    }

    public function managedBranchesByUser(Request $request)
    {
        $request->validate([
            'idBranch' => ['required', 'exists:branches,id'],
            'user' => ['required', 'exists:users,id'],
        ]);

        $user = User::find($request->user);
        $branch = Branch::find($request->idBranch);

        if ($user->hasRole('admin'))
        {
            return response()->json(['message' => 'No puedes agregar o quitar sucursales a un administrador', 'success' => false]);
        }

        if ($branch->status === 'inactive') {
            return response()->json(['message' => 'La sucursal se encuentra deshabilitada', 'success' => false]);
        }

        if ($user->branches()->where('branches.id', $branch->id)->exists())
        {
            $user->branches()->detach($branch->id);

            DB::table('model_has_module_role')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_modules')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menus')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenus')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_module_permissions')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_menu_permissions')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            DB::table('model_has_submenu_permissions')
                ->where('model_id', $user->id)
                ->where('branch_id', $branch->id)
                ->delete();

            return response()->json(['message' => 'Sucursal quitada con exito', 'action' => 'delete', 'success' => true]);
        }

        $user->branches()->attach($request->idBranch, ['model_type' => User::class]);

        return response()->json(['message' => 'Sucursal agregada con exito', 'action' => 'add', 'success' => true]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
