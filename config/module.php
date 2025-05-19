<?php

return [
    'enabled_modules' => [
        [
            'key' => 'control-acceso',
            'name' => 'Control de Acceso',
            'menus' => [
                ['key' => 'usuarios', 'name' => 'Usuarios'],
                ['key' => 'roles', 'name' => 'Roles'],
                ['key' => 'modulos', 'name' => 'Modulos'],
                ['key' => 'menus', 'name' => 'Menus'],
                ['key' => 'submenus', 'name' => 'Submenus'],
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
                    'submenus' => [],
                ],
                [
                    'key' => 'pas',
                    'name' => 'P.A.S.',
                    'submenus' => [],
                ],
                [
                    'key' => 'turismo',
                    'name' => 'Turismo',
                    'submenus' => [],
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
                    'submenus' => []
                ],
                [
                    'key' => 'reportes',
                    'name' => 'Reportes',
                    'submenus' => []
                ],
                [
                    'key' => 'configuracion',
                    'name' => 'Configuracion',
                    'submenus' => []
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
                    'submenus' => []
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
                    'submenus' => []
                ],
                [
                    'key' => 'configuracion',
                    'name' => 'Configuracion',
                    'submenus' => []
                ],
            ]
        ],
        [
            'key' => 'inventario',
            'name' => 'Inventario',
            'menus' => []
        ],
        [
            'key' => 'seccionales',
            'name' => 'Seccionales',
            'menus' => []
        ],
        [
            'key' => 'ventas',
            'name' => 'Ventas',
            'menus' => []
        ],
    ],
];
