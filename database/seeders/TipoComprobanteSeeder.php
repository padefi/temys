<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\TipoComprobante;

class TipoComprobanteSeeder extends Seeder
{
    public function run()
    {
        $tipos = [
            ['nombre'=>'Factura A','codigo_arca'=>'001','signo'=>'debe','categoria'=>'factura','afecta_saldo'=>true],
            ['nombre'=>'Factura B','codigo_arca'=>'006','signo'=>'debe','categoria'=>'factura','afecta_saldo'=>true],
            ['nombre'=>'Factura C','codigo_arca'=>'011','signo'=>'debe','categoria'=>'factura','afecta_saldo'=>true],
            ['nombre'=>'Nota de Crédito A','codigo_arca'=>'003','signo'=>'haber','categoria'=>'nota_credito','afecta_saldo'=>true],
            ['nombre'=>'Nota de Crédito B','codigo_arca'=>'008','signo'=>'haber','categoria'=>'nota_credito','afecta_saldo'=>true],
            ['nombre'=>'Nota de Débito A','codigo_arca'=>'002','signo'=>'debe','categoria'=>'nota_debito','afecta_saldo'=>true],
            ['nombre'=>'Nota de Débito B','codigo_arca'=>'007','signo'=>'debe','categoria'=>'nota_debito','afecta_saldo'=>true],
            ['nombre'=>'Anticipo','codigo_arca'=>null,'signo'=>'debe','categoria'=>'anticipo','afecta_saldo'=>true],
            ['nombre'=>'Recibo','codigo_arca'=>null,'signo'=>'haber','categoria'=>'recibo','afecta_saldo'=>true],
            ['nombre'=>'Ajuste Interno','codigo_arca'=>null,'signo'=>'debe','categoria'=>'otros','afecta_saldo'=>true],
        ];

        foreach ($tipos as $tipo) {
            TipoComprobante::create($tipo);
        }
    }
}
