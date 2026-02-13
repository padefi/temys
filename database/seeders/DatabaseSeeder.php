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
            NacionalidadesSeeder::class,
            UserSeeder::class,
            PadronSeeder::class,
            ClienteSeeder::class,
            ProveedorSeeder::class,
            InmueblesTipoEstadoSeeder::class,
            InmueblesTipoOcupacionSeeder::class,
            InmueblesTipoSeeder::class,
            InmueblesSeeder::class,
            InmueblesTipoContratoSeeder::class,
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
            ImpuestoSeeder::class,
            OrdenCotizacionDetalleSeeder::class,
            SolicitudCompraOrdenCotizacionSeeder::class,
            OrdenCompraSeeder::class,
            OrdenCompraDetalleSeeder::class,
            InventarioStockSeeder::class,
            /*InventarioMovimientoStockSeeder::class,*/
            InventarioRelacionUserAlmacenSeeder::class,
            PlanCuentasSeeder::class,
            BancoSeeder::class,
            CuentaBancariaSeeder::class,
            TarjetaSeeder::class,
            ChequeSeeder::class,
            //MetodoPagoSeeder::class,
            EntidadFinancieraSeeder::class,
            PadronDatoBancarioSeeder::class,
            ProveedorDatoBancarioSeeder::class,
            ActividadEconomicaProveedorSeeder::class,
            CondicionIvaSeeder::class,
            CondicionVentaSeeder::class,
            TipoComprobanteSeeder::class,
            UnidadMedidaSeeder::class,
            ComprobanteSeeder::class,
            ComprobanteDetalleSeeder::class,
            ComprobanteDetalleImpuestoSeeder::class,
            RelacionComprobanteOrdenPagoProveedorSeeder::class,
            RelacionProveedorActividadSeeder::class,
            RelacionProveedorCondicionSeeder::class,
            OrdenPagoSeeder::class,
            MetodoTesoreriaSeeder::class,
            MovimientoTesoreriaSeeder::class,
            /*ProvinciaSeeder::class,
            LocalidadSeeder::class,
            CalleSeeder::class,*/
            OrdenCotizacionVentaSeeder::class,
            OrdenCotizacionVentaDetalleSeeder::class,
            OrdenVentaSeeder::class,
            OrdenVentaDetalleSeeder::class,
            ComprobanteSeeder::class,
            ImpuestoSeeder::class,
            ComprobanteDetalleImpuestoSeeder::class,
            AsientoSeeder::class,
            PartidaSeeder::class,
            RelacionComprobantePartidaSeeder::class,
            RelacionComprobanteComprobanteSeeder::class,
            SolicitudVentaSeeder::class,
            //SolicitudVentaOrdenCotizacionVentaSeeder::class,
            OrdenVentaSeeder::class,
            OrdenVentaDetalleSeeder::class,
            ComprobanteSeeder::class,
            ImpuestoSeeder::class,
            ComprobanteDetalleImpuestoSeeder::class,
            OrdenTesoreriaCobroChequeSeeder::class,
            OrdenTesoreriaCobroTarjetaSeeder::class,
            OrdenTesoreriaCobroTransferenciaSeeder::class,
            OrdenTesoreriaCobroEfectivoSeeder::class,
            OrdenTesoreriaPagoTransferenciaSeeder::class,
            OrdenTesoreriaPagoEfectivoSeeder::class,
            OrdenTesoreriaPagoChequeSeeder::class,
            OrdenTesoreriaPagoTarjetaSeeder::class,
            MotivoNotaCreditoSeeder::class,
            MotivoReembolsoSeeder::class,
            MotivoNotaDebitoSeeder::class,
            /* InventarioMovimientoEstadosSeeder::class,
            InventarioStockTransitoSeeder::class, */
        ]);
    }
}
