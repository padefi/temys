<?php

return [
    'enabled_modules' => [
        [
            'key' => 'control-acceso',
            'name' => 'Control de Acceso',
            'menus' => [
                ['key' => 'branches', 'name' => 'Sucursales'],
                ['key' => 'usuariosControlAcceso', 'name' => 'Usuarios'],
            ]
        ],
        [
            'key' => 'afiliados',
            'name' => 'Afiliados',
            'menus' => [
                [
                    'key' => 'afiliados',
                    'name' => 'Afiliados',
                    'submenus' => [
                        ['key' => 'dataEntry', 'name' => 'Data entry'],
                        ['key' => 'afiliados', 'name' => 'Afiliados'],
                        ['key' => 'controlIngresos', 'name' => 'Control de ingresos'],
                    ],
                ],
                [
                    'key' => 'beneficios',
                    'name' => 'Beneficios',
                    'submenus' => [
                        ['key' => 'natalidad', 'name' => 'Natalidad'],
                        ['key' => 'lunaDeMiel', 'name' => 'Luna de miel'],
                        ['key' => 'casamiento', 'name' => 'Casamiento'],
                    ],
                ],
                [
                    'key' => 'fondoDeSepelio',
                    'name' => 'Fondo de sepelio',
                    'submenus' => [
                        ['key' => 'reintegros', 'name' => 'Reintegros'],
                        ['key' => 'protesisOrtesis', 'name' => 'Protesis y ortesis'],
                    ],
                ],
                [
                    'key' => 'pas',
                    'name' => 'P.A.S.',
                ],
                [
                    'key' => 'turismo',
                    'name' => 'Turismo',
                ],
                [
                    'key' => 'configuracionAfiliados',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'usuariosAfiliados', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'compras',
            'name' => 'Compras',
            'menus' => [
                [
                    'key' => 'ordenesCompras',
                    'name' => 'Ordenes',
                    'submenus' => [
                        ['key' => 'cotizacionesOrdenesCompras', 'name' => 'Cotizaciones'],
                        ['key' => 'ordenesCompras', 'name' => 'Ordenes'],
                        ['key' => 'equiposDeVentas', 'name' => 'Equipos de ventas'],
                        ['key' => 'proveedoresCompras', 'name' => 'Proveedores'],
                    ]
                ],
                [
                    'key' => 'productosCompras',
                    'name' => 'Productos',
                    'submenus' => [
                        ['key' => 'productosCompras', 'name' => 'Productos'],
                        ['key' => 'variantesProductosCompras', 'name' => 'Variantes de productos'],
                    ]
                ],
                [
                    'key' => 'reportesCompras',
                    'name' => 'Reportes',
                    'submenus' => [
                        ['key' => 'compra', 'name' => 'Compra'],
                    ]
                ],
                [
                    'key' => 'configuracionCompras',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'ajustesCompras', 'name' => 'Ajustes'],
                        ['key' => 'listaPreciosProveedor', 'name' => 'Lista de precios del proveedor'],
                        ['key' => 'usuariosCompras', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'contabilidad',
            'name' => 'Contabilidad',
            'menus' => [
                [
                    'key' => 'tablero',
                    'name' => 'Tablero',
                ],
                [
                    'key' => 'clientes',
                    'name' => 'Clientes',
                    'submenus' => [
                        ['key' => 'facturasClientes', 'name' => 'Facturas'],
                        ['key' => 'notasDeCredito', 'name' => 'Notas de credito'],
                        ['key' => 'notasDeDebito', 'name' => 'Notas de debito'],
                        ['key' => 'pagosClientes', 'name' => 'Pagos'],
                        ['key' => 'productosClientes', 'name' => 'Productos'],
                        ['key' => 'clientes', 'name' => 'Clientes'],
                    ]
                ],
                [
                    'key' => 'proveedores',
                    'name' => 'Proveedores',
                    'submenus' => [
                        ['key' => 'facturasProveedores', 'name' => 'Facturas'],
                        ['key' => 'reembolsos', 'name' => 'Reembolsos'],
                        ['key' => 'pagosProveedores', 'name' => 'Pagos'],
                        ['key' => 'productosProveedores', 'name' => 'Productos'],
                        ['key' => 'proveedores', 'name' => 'Proveedores'],
                    ]
                ],
                [
                    'key' => 'contabilidad',
                    'name' => 'Contabilidad',
                    'submenus' => [
                        ['key' => 'asientosContables', 'name' => 'Asientos contables'],
                        ['key' => 'apuntesContables', 'name' => 'Apuntes contables'],
                        ['key' => 'apuntesAnaliticos', 'name' => 'Apuntes analiticos'],
                        ['key' => 'activos', 'name' => 'Activos'],
                        ['key' => 'prestamos', 'name' => 'Prestamos'],
                        ['key' => 'conciliar', 'name' => 'Conciliar'],
                        ['key' => 'fechaBloqueo', 'name' => 'Fecha de bloqueo'],
                        ['key' => 'consultaFacturaAfip', 'name' => 'Consulta de factura afip'],
                    ]
                ],
                [
                    'key' => 'reportesContabilidad',
                    'name' => 'Reportes',
                    'submenus' => [
                        ['key' => 'balanceGeneral', 'name' => 'Balance general'],
                        ['key' => 'estadoResultado', 'name' => 'Estado de resultados'],
                        ['key' => 'estadoFlujoEfectivo', 'name' => 'Estado de flujo de efectivo'],
                        ['key' => 'resumenEjecutivo', 'name' => 'Resumen ejecutivo'],
                        ['key' => 'declaracionFiscal', 'name' => 'Declaracion fiscal'],
                        ['key' => 'libroMayor', 'name' => 'Libro mayor'],
                        ['key' => 'balanceComprobacion', 'name' => 'Balance de comprobacion'],
                        ['key' => 'auditoriaDiario', 'name' => 'Auditoria de diario'],
                        ['key' => 'libroMayorEmpresa', 'name' => 'Libro mayor de la empresa'],
                        ['key' => 'cuentasPorCobrarVencidas', 'name' => 'Cuentas por cobrar vencidas'],
                        ['key' => 'cuentaPorPagarVencidas', 'name' => 'Cuenta por pagar vencida'],
                        ['key' => 'analisisFacturas', 'name' => 'Analisis de facturas'],
                        ['key' => 'reporteAnalitico', 'name' => 'Reporte analitico'],
                        ['key' => 'gananciasPerdidasPorCambiosDivisaNoRealizados', 'name' => 'Ganancias/Perdidas por cambios de divisa no realizadas'],
                        ['key' => 'ingresosDiferidos', 'name' => 'Ingresos diferidos'],
                        ['key' => 'gastoDiferido', 'name' => 'Gasto diferido'],
                        ['key' => 'gastosRechazados', 'name' => 'Gastos rechazados'],
                        ['key' => 'programaDepreciacion', 'name' => 'Programa de depreciacion'],
                        ['key' => 'analisisPrestamos', 'name' => 'Analisis de prestamos'],
                        ['key' => 'resumenIva', 'name' => 'Resumen iva'],
                        ['key' => 'ingresosBrutosPorJurisdiccion', 'name' => 'IIBB Ventas por jurisdiccion'],
                        ['key' => 'comprasBrutosPorJurisdiccion', 'name' => 'IIBB Compras por jurisdiccion'],
                    ]
                ],
                [
                    'key' => 'configuracionContabilidad',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'ajustesContabilidad', 'name' => 'Ajustes'],
                        ['key' => 'planCuentas', 'name' => 'Plan de cuentas'],
                        ['key' => 'impuestos', 'name' => 'Impuestos'],
                        ['key' => 'diarios', 'name' => 'Diarios'],
                        ['key' => 'monedas', 'name' => 'Monedas'],
                        ['key' => 'posicionesFiscales', 'name' => 'Posiciones fiscales'],
                        ['key' => 'variosLibrosMayores', 'name' => 'Varios libros mayores'],
                        ['key' => 'categoriasFiscales', 'name' => 'Categorias fiscales'],
                        ['key' => 'modelosActivos', 'name' => 'Modelos de activos'],
                        ['key' => 'tiposDocumentos', 'name' => 'Tipos de documentos'],
                        ['key' => 'terminosPago', 'name' => 'Terminos de pago'],
                        ['key' => 'nivelesSeguimiento', 'name' => 'Niveles de seguimiento'],
                        ['key' => 'categoriasProductos', 'name' => 'Categorias de productos'],
                        ['key' => 'proveedoresPago', 'name' => 'Proveedores de pago'],
                        ['key' => 'metodosPago', 'name' => 'Metodos de pago'],
                        ['key' => 'tiposDocumentos', 'name' => 'Tipos de documentos'],
                        ['key' => 'tiposResponsabilidad', 'name' => 'Tipos de responsabilidad'],
                        ['key' => 'usuariosContabilidad', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'inventario',
            'name' => 'Inventario',
            'menus' => [
                [
                    'key' => 'informacionGeneral',
                    'name' => 'Informacion general',
                ],
                [
                    'key' => 'operaciones',
                    'name' => 'Operaciones',
                    'submenus' => [
                        ['key' => 'recepciones', 'name' => 'Recepciones'],
                        ['key' => 'entregas', 'name' => 'Entregas'],
                        ['key' => 'inventarioFisico', 'name' => 'Inventario fisico'],
                        ['key' => 'desechar', 'name' => 'Desechar'],
                        ['key' => 'reabastecimiento', 'name' => 'Reabastecimiento'],
                    ]
                ],
                [
                    'key' => 'productosInventario',
                    'name' => 'Productos',
                    'submenus' => [
                        ['key' => 'productosInventario', 'name' => 'Productos'],
                        ['key' => 'variantesProductosInventario', 'name' => 'Variantes de productos'],
                    ]
                ],
                [
                    'key' => 'reportesInventario',
                    'name' => 'Reportes',
                    'submenus' => [
                        ['key' => 'existencias', 'name' => 'Existencias'],
                        ['key' => 'historialMovimientos', 'name' => 'Historial de movimientos'],
                        ['key' => 'analisisMovimientos', 'name' => 'Analisis de movimientos'],
                        ['key' => 'valoracion', 'name' => 'Valoracion'],

                    ]
                ],
                [
                    'key' => 'configuracionInventario',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'ajustesInventario', 'name' => 'Ajustes'],
                        ['key' => 'almacenes', 'name' => 'Almacenes'],
                        ['key' => 'tipoOperaciones', 'name' => 'Tipos de operaciones'],
                        ['key' => 'categorias', 'name' => 'Categorias'],
                        ['key' => 'atributos', 'name' => 'Atributos'],
                        ['key' => 'metodosEntrega', 'name' => 'Metodos de entrega'],
                        ['key' => 'usuariosInventario', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'seccionales',
            'name' => 'Seccionales',
            'menus' => [
                [
                    'key' => 'configuracionSeccionales',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'usuariosSeccionales', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'ventas',
            'name' => 'Ventas',
            'menus' => [
                [
                    'key' => 'ordenesInventario',
                    'name' => 'Ordenes',
                    'submenus' => [
                        ['key' => 'cotizacionesVentas', 'name' => 'Cotizaciones'],
                        ['key' => 'ordenesInventario', 'name' => 'Ordenes'],
                        ['key' => 'equiposVentas', 'name' => 'Equipos de ventas'],
                        ['key' => 'clientes', 'name' => 'Clientes'],
                    ]
                ],
                [
                    'key' => 'porFacturar',
                    'name' => 'Por facturar',
                    'submenus' => [
                        ['key' => 'ordenesAFacturar', 'name' => 'Ordenes a facturar'],
                        ['key' => 'ordenesParaCrearVentasAdicionales', 'name' => 'Ordenes para crear ventas adicionales'],
                    ]
                ],
                [
                    'key' => 'productosVentas',
                    'name' => 'Productos',
                    'submenus' => [
                        ['key' => 'productosVentas', 'name' => 'Productos'],
                        ['key' => 'variantesProductosVentas', 'name' => 'Variantes de productos'],
                        ['key' => 'listaPrecios', 'name' => 'Lista de precios'],
                    ]
                ],
                [
                    'key' => 'reportesVentas',
                    'name' => 'Reportes',
                    'submenus' => [
                        ['key' => 'ventas', 'name' => 'Ventas'],
                        ['key' => 'vededores', 'name' => 'Vendedores'],
                        ['key' => 'productos', 'name' => 'Productos'],
                        ['key' => 'clientes', 'name' => 'Clientes'],
                    ]
                ],
                [
                    'key' => 'configuracionVentas',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'ajustesVentas', 'name' => 'Ajustes'],
                        ['key' => 'equiposVentas', 'name' => 'Equipos de ventas'],
                        ['key' => 'metodosEntrega', 'name' => 'Metodos de entrega'],
                        ['key' => 'etiquetas', 'name' => 'Etiquetas'],
                        ['key' => 'atributos', 'name' => 'Atributos'],
                        ['key' => 'opcionesCombos', 'name' => 'Opciones de los combos'],
                        ['key' => 'categorias', 'name' => 'Categorias'],
                        ['key' => 'etiquetasProducto', 'name' => 'Etiquetas de producto'],
                        ['key' => 'proveedoresPago', 'name' => 'Proveedores de pago'],
                        ['key' => 'metodosPago', 'name' => 'Metodos de pago'],
                        ['key' => 'planesActividad', 'name' => 'Planes de actividad'],
                        ['key' => 'usuariosVentas', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
        [
            'key' => 'patrimonio',
            'name' => 'Patrimonio',
            'menus' => [
                [
                    'key' => 'inmuebles',
                    'name' => 'Inmuebles',
                    'submenus' => [
                        ['key' => 'inmuebles', 'name' => 'Inmuebles'],
                        ['key' => 'impuestosTasas', 'name' => 'Impuestos y tasas'],
                        ['key' => 'serviciosInmuebles', 'name' => 'Servicios'],
                        ['key' => 'contratos', 'name' => 'Contratos'],
                    ]
                ],
                [
                    'key' => 'automotores',
                    'name' => 'Automotores',
                    'submenus' => [
                        ['key' => 'automotores', 'name' => 'Automotores'],
                        ['key' => 'impuestosTasas', 'name' => 'Impuestos y tasas'],
                        ['key' => 'infracciones', 'name' => 'Infracciones'],
                        ['key' => 'mantenimientoAutomotores', 'name' => 'Mantenimiento'],
                    ]
                ],
                [
                    'key' => 'mobiliarios',
                    'name' => 'Mobiliarios',
                    'submenus' => [
                        ['key' => 'mobiliarios', 'name' => 'Mobiliarios'],
                        ['key' => 'reporteExistencia', 'name' => 'Reporte de existencia'],
                    ]
                ],
                [
                    'key' => 'configuracionPatrimonio',
                    'name' => 'Configuracion',
                    'submenus' => [
                        ['key' => 'usuariosPatrimonio', 'name' => 'Usuarios'],
                    ]
                ],
            ]
        ],
    ],
];
