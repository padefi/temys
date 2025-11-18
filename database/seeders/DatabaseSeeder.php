<?php

namespace Database\Seeders;

// use App\Models\ControlAcceso\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            RoleModuleSeeder::class,
            PermissionSeeder::class,
            ModuleSeeder::class,
            MenuSeeder::class,
            SubmenuSeeder::class,
            RolePermissionSeeder::class,
            RoleModulePermissionSeeder::class,
            UserSeeder::class,
            PadronSeeder::class,
            ClienteSeeder::class,
            ProveedorSeeder::class,
            InmueblesTipoEstadoSeeder::class,
            InmueblesTipoOcupacionSeeder::class,
            InmueblesTipoSeeder::class,
            InmueblesSeeder::class,
            TipoMonedaSeeder::class,
            CaracteristicaSeeder::class,
            CategoriaSeeder::class,
            SubcategoriaSeeder::class,
            MarcaSeeder::class,
            ModeloSeeder::class,
            ProductoSeeder::class,
            AlmacenSeeder::class,
            SolicitudCompraSeeder::class,
            OrdenCotizacionSeeder::class,
            OrdenCotizacionDetalleSeeder::class,
            ImpuestoSeeder::class,
            SolicitudCompraOrdenCotizacionSeeder::class,
            OrdenCompraSeeder::class,
            OrdenCompraDetalleSeeder::class,
            InventarioStockSeeder::class,
           /*  InventarioMovimientoStockSeeder::class, */
            InventarioRelacionUserAlmacenSeeder::class,
            PlanCuentasSeeder::class,
            BancoSeeder::class,
            CuentaBancariaSeeder::class,
            TarjetaSeeder::class,
            ChequeSeeder::class,
            MetodoPagoSeeder::class,
            ProveedorCbuSeeder::class,
            CondicionVentaSeeder::class,
            TipoComprobanteSeeder::class,
            UnidadMedidaSeeder::class,
            ComprobanteProveedorSeeder::class,
            ComprobanteProveedorDetalleSeeder::class,
            ComprobanteProveedorDetalleImpuestoSeeder::class,
            RelacionComprobanteOrdenPagoProveedorSeeder::class,
            OrdenPagoSeeder::class,
            MovimientoTesoreriaSeeder::class,
            ProvinciaSeeder::class,
            LocalidadSeeder::class,
            CalleSeeder::class,
/*             InventarioMovimientoEstadosSeeder::class,
            InventarioStockTransitoSeeder::class, */
        ]);
    }
}
