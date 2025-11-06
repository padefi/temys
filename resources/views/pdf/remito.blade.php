<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Remito R</title>
    <style>
        body {
            font-family: sans-serif;
            font-size: 11px;
            margin: 0;
            padding: 15px;
        }
        .box {
            border: 2px solid black;
            border-radius: 10px;
            padding: 10px;
        }
        .flex {
            display: flex;
            justify-content: space-between;
        }
        .center { text-align: center; }
        .bold { font-weight: bold; }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 5px;
        }
        table td, table th {
            border: 1px solid black;
            padding: 4px;
        }
        .no-border td {
            border: none;
        }
        .footer {
            font-size: 10px;
            margin-top: 20px;
            text-align: center;
        }
        .firma {
            margin-top: 40px;
            text-align: right;
        }
    </style>
</head>
<body>
<div class="box">
    <table style="width: 100%; border-collapse: collapse;text-align:center;">
        <tr>
            <!-- LOGO + DATOS -->
            <td style="width: 45%; vertical-align: top;">
                <div style="font-weight: bold; font-size: 20px;">● UNIÓN FERROVIARIA</div>
                <div style="font-size: 12px;">IMPORTACIÓN - EXPORTACIÓN</div>
                <div style="font-size: 11px;">AVENIDA INDEPENDENCIA 2880</div>
                <div style="font-size: 11px;">CP1225 - CABA - 1130405060</div>
                <div style="font-size: 11px;">E-mail: contacto@unionferroviaria.org.ar</div>
                <div style="font-size: 10px; margin-top: 4px;">IVA RESPONSABLE INSCRIPTO</div>
            </td>
    
            <!-- CÓDIGO R -->
            <td style="width: 10%; text-align: center; border: 1px solid black;">
                <div style="font-weight: bold; font-size: 20px;">R</div>
                <div style="font-size: 9px;">Cod. 91</div>
            </td>
    
            <!-- DATOS REMITO -->
            <td style="width: 45%; vertical-align: top; padding-left: 10px;">
                <div style="font-weight: bold; text-align: center;">REMITO</div>
                <div style="font-size: 10px; text-align: center;">DOCUMENTO NO VÁLIDO<br>COMO FACTURA</div>
    
                <div style="margin-top: 5px; font-size: 12px;">
                    <strong>N°0001 - {{ str_pad($orden->id, 7, '0', STR_PAD_LEFT) }}</strong>
                </div>
                <div style="font-size: 11px;">Fecha: {{ $orden->fecha_envio->format('d/m/Y') }}</div>
    
                <div style="font-size: 10px; margin-top: 4px;">
                    CUIT: 30-54670727-6<br>
                    Ing. Brutos C.M.: 901-000000-1<br>
                    Inicio Actividades: 06/10/1922
                </div>
            </td>
        </tr>
    </table>

    <hr>

    <table class="no-border">
        <tr>
            <td>Destino: {{ $orden->destino->nombre }}</td>
        </tr>
        <tr>
            <td>Domicilio: ________________________________________ Localidad _______________________</td>
        </tr>
        <tr>
            <td>IVA <input type="checkbox"> Responsable Inscripto &nbsp;&nbsp;&nbsp;&nbsp; CUIT ______________________</td>
        </tr>
        <tr>
            <td>
                Condiciones de venta: Contado <input type="checkbox"> &nbsp;&nbsp;&nbsp;&nbsp; Cta. Cte. <input type="checkbox"> &nbsp;&nbsp;&nbsp;&nbsp; Factura Nº ____________________
            </td>
        </tr>
    </table>

    <table>
        <thead>
            <tr>
                <th style="width: 20%;">CANTIDAD</th>
                <th>DESCRIPCIÓN</th>
            </tr>
        </thead>
        <tbody>
            @foreach($orden->detalles as $detalle)
                <tr>
                    <td>{{ $detalle->cantidad_enviada }}</td>
                    <td>{{ $detalle->producto->nombre }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <br>

    <table style="width: 100%; border: 1px solid black; border-collapse: collapse; margin-top: 30px; font-size: 11px;">
        <tr>
            <!-- COLUMNA IZQUIERDA -->
            <td style="width: 50%; border-right: 1px solid black; padding: 10px;">
                <div><strong>Transporte</strong>  .................................................................</div>
                <div><strong>Domicilio</strong>  ..................................................................</div>
                <div><strong>CUIT</strong>  .........................................................................</div>
                <div style="margin-top: 8px;"><strong>Observaciones</strong>  ....................................................</div>
            </td>
    
            <!-- COLUMNA DERECHA -->
            <td style="width: 50%; text-align: center; vertical-align: bottom; padding: 10px;">
                <div style="margin-bottom: 20px;">.............................................................</div>
                <div><strong style="font-size: 10px;">RECIBÍ CONFORME</strong></div>
            </td>
        </tr>
    </table>

    <table style="width: 100%; border: 1px solid black; border-top: none; border-collapse: collapse; font-size: 10px;">
        <tr>
            <!-- IZQUIERDA -->
            <td style="width: 40%; padding: 4px;">
                Imprimió Temys Impresoras, sucesión de Juan P. Temys<br>
                CUIT: 20-04487422-1 &nbsp;&nbsp; - &nbsp;&nbsp; Fecha de impresión: 10/2025<br>
                Numerado del N° 0001-00000851 al 0001-00001250
            </td>
    
            <!-- CENTRO -->
            <td style="width: 30%; padding: 4px; text-align: center;">
                <strong>147</strong> Teléfono gratuito CABA<br>
                Área de defensa y protección<br>
                al consumidor
            </td>
    
            <!-- DERECHA -->
            <td style="width: 30%; padding: 4px; text-align: right;">
                <strong>ORIGINAL blanco - DUPLICADO amarillo</strong><br>
                <strong>CAI: 450000000000003</strong><br>
                <strong>F. VTO: 06/12/2025</strong>
            </td>
        </tr>
    </table>
</div>
</body>
</html>