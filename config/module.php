<?php

return [
    'enabled_modules' => [
        [
            'key' => 'control-acceso',
            'name' => 'Control de Acceso',
            'menus' => [
                ['key' => 'roles', 'name' => 'Roles'],
                ['key' => 'modulos', 'name' => 'Modulos'],
                ['key' => 'menus', 'name' => 'Menus'],
                ['key' => 'submenus', 'name' => 'Submenus'],
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
                        ['key' => 'consultaAfiliados', 'name' => 'Consulta de afiliados'],
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
                    'key' => 'usuariosAfiliados',
                    'name' => 'Usuarios'
                ],
            ]
        ],
        [
            'key' => 'compras',
            'name' => 'Compras',
            'menus' => [
                [
                    'key' => 'ordenes',
                    'name' => 'Ordenes',
                    'submenus' => [
                        ['key' => 'cotizaciones', 'name' => 'Cotizaciones'],
                        ['key' => 'ordenes', 'name' => 'Ordenes'],
                        ['key' => 'equiposDeVentas', 'name' => 'Equipos de ventas'],
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
                    'key' => 'productos',
                    'name' => 'Productos',
                ],
                [
                    'key' => 'reportes',
                    'name' => 'Reportes',
                ],
                [
                    'key' => 'configuracion',
                    'name' => 'Configuracion',
                ],
                [
                    'key' => 'usuariosCompras',
                    'name' => 'Usuarios'
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
                        ['key' => 'consultaDeClientes', 'name' => 'Consulta de clientes'],
                        ['key' => 'notasDeDebito', 'name' => 'Notas de debito'],
                        ['key' => 'notasDeCredito', 'name' => 'Notas de credito'],
                    ]
                ],
                [
                    'key' => 'proveedores',
                    'name' => 'Proveedores',
                    'submenus' => [
                        ['key' => 'consultaDeProveedores', 'name' => 'Consulta de proveedores'],
                        ['key' => 'notasDeDebitoProveedores', 'name' => 'Notas de debito'],
                        ['key' => 'notasDeCreditoProveedores', 'name' => 'Notas de credito'],
                    ]
                ],
                [
                    'key' => 'contabilidad',
                    'name' => 'Contabilidad',
                    'submenus' => [
                        ['key' => 'consultaDeCuentas', 'name' => 'Consulta de cuentas'],
                        ['key' => 'consultaDeAsientos', 'name' => 'Consulta de asientos'],
                        ['key' => 'consultaDeAsientosPorCuenta', 'name' => 'Consulta de asientos por cuenta'],
                    ]
                ],
                [
                    'key' => 'reportes',
                    'name' => 'Reportes',
                ],
                [
                    'key' => 'configuracion',
                    'name' => 'Configuracion',
                ],
                [
                    'key' => 'usuariosContabilidad',
                    'name' => 'Usuarios'
                ],
            ]
        ],
        [
            'key' => 'inventario',
            'name' => 'Inventario',
            'menus' => [
                [
                    'key' => 'usuariosInventario',
                    'name' => 'Usuarios'
                ],
            ]
        ],
        [
            'key' => 'seccionales',
            'name' => 'Seccionales',
            'menus' => [
                [
                    'key' => 'usuariosSeccionales',
                    'name' => 'Usuarios'
                ],
            ]
        ],
        [
            'key' => 'ventas',
            'name' => 'Ventas',
            'menus' => [
                [
                    'key' => 'usuariosVentas',
                    'name' => 'Usuarios'
                ],
            ]
        ],
    ],
];
