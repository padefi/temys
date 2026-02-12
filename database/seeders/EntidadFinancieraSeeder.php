<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Padron\EntidadFinanciera;
use App\Models\ControlAcceso\User;
use App\Models\General\Nacionalidad;

class EntidadFinancieraSeeder extends Seeder
{
    public function run(): void
    {
        $usuarioId = User::inRandomOrder()->value('id');
        $nacionalidadArgentina = Nacionalidad::where('nacionalidad', 'Argentina')->value('id');

        $entidades = [
            //BANCOS (CBU)
            ['codigo' => '007', 'descripcion' => 'BANCO DE GALICIA Y BUENOS AIRES S.A.U.', 'tipo' => 'Banco'],
            ['codigo' => '011', 'descripcion' => 'BANCO DE LA NACION ARGENTINA', 'tipo' => 'Banco'],
            ['codigo' => '014', 'descripcion' => 'BANCO DE LA PROVINCIA DE BUENOS AIRES', 'tipo' => 'Banco'],
            ['codigo' => '015', 'descripcion' => 'INDUSTRIAL AND COMMERCIAL BANK OF CHINA', 'tipo' => 'Banco'],
            ['codigo' => '016', 'descripcion' => 'CITIBANK N.A.', 'tipo' => 'Banco'],
            ['codigo' => '017', 'descripcion' => 'BANCO BBVA FRANCES S.A.', 'tipo' => 'Banco'],
            ['codigo' => '020', 'descripcion' => 'BANCO DE LA PROVINCIA DE CORDOBA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '027', 'descripcion' => 'BANCO SUPERVIELLE S.A.', 'tipo' => 'Banco'],
            ['codigo' => '029', 'descripcion' => 'BANCO DE LA CIUDAD DE BUENOS AIRES', 'tipo' => 'Banco'],
            ['codigo' => '034', 'descripcion' => 'BANCO PATAGONIA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '044', 'descripcion' => 'BANCO HIPOTECARIO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '045', 'descripcion' => 'BANCO DE SAN JUAN S.A.', 'tipo' => 'Banco'],
            ['codigo' => '065', 'descripcion' => 'BANCO MUNICIPAL DE ROSARIO', 'tipo' => 'Banco'],
            ['codigo' => '072', 'descripcion' => 'BANCO SANTANDER RIO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '083', 'descripcion' => 'BANCO DEL CHUBUT S.A.', 'tipo' => 'Banco'],
            ['codigo' => '086', 'descripcion' => 'BANCO DE SANTA CRUZ S.A.', 'tipo' => 'Banco'],
            ['codigo' => '093', 'descripcion' => 'BANCO DE LA PAMPA S.E.M.', 'tipo' => 'Banco'],
            ['codigo' => '094', 'descripcion' => 'BANCO DE CORRIENTES S.A.', 'tipo' => 'Banco'],
            ['codigo' => '097', 'descripcion' => 'BANCO PROVINCIA DEL NEUQUEN S.A.', 'tipo' => 'Banco'],
            ['codigo' => '143', 'descripcion' => 'BRUBANK S.A.U.', 'tipo' => 'Banco'],
            ['codigo' => '147', 'descripcion' => 'BANCO INTERFINANZAS S.A.', 'tipo' => 'Banco'],
            ['codigo' => '150', 'descripcion' => 'HSBC BANK ARGENTINA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '165', 'descripcion' => 'JPMORGAN CHASE BANK N.A.', 'tipo' => 'Banco'],
            ['codigo' => '191', 'descripcion' => 'BANCO CREDICOOP COOPERATIVO LIMITADO', 'tipo' => 'Banco'],
            ['codigo' => '198', 'descripcion' => 'BANCO DE VALORES S.A.', 'tipo' => 'Banco'],
            ['codigo' => '247', 'descripcion' => 'BANCO ROELA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '254', 'descripcion' => 'BANCO MARIVA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '259', 'descripcion' => 'BANCO ITAU ARGENTINA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '262', 'descripcion' => 'BANK OF AMERICA N.A.', 'tipo' => 'Banco'],
            ['codigo' => '266', 'descripcion' => 'BNP PARIBAS', 'tipo' => 'Banco'],
            ['codigo' => '268', 'descripcion' => 'BANCO PROVINCIA DE TIERRA DEL FUEGO', 'tipo' => 'Banco'],
            ['codigo' => '269', 'descripcion' => 'BANCO DE LA REP. ORIENTAL DEL URUGUAY', 'tipo' => 'Banco'],
            ['codigo' => '277', 'descripcion' => 'BANCO SAENZ S.A.', 'tipo' => 'Banco'],
            ['codigo' => '281', 'descripcion' => 'BANCO MERIDIAN S.A.', 'tipo' => 'Banco'],
            ['codigo' => '285', 'descripcion' => 'BANCO MACRO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '299', 'descripcion' => 'BANCO COMAFI S.A.', 'tipo' => 'Banco'],
            ['codigo' => '300', 'descripcion' => 'BANCO DE INVERSION Y COMERCIO EXTERIOR S.A.', 'tipo' => 'Banco'],
            ['codigo' => '301', 'descripcion' => 'BANCO PIANO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '305', 'descripcion' => 'BANCO JULIO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '309', 'descripcion' => 'BANCO RIOJA S.A.U.', 'tipo' => 'Banco'],
            ['codigo' => '310', 'descripcion' => 'BANCO DEL SOL S.A.', 'tipo' => 'Banco'],
            ['codigo' => '311', 'descripcion' => 'NUEVO BANCO DEL CHACO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '312', 'descripcion' => 'BANCO VOII S.A.', 'tipo' => 'Banco'],
            ['codigo' => '315', 'descripcion' => 'BANCO DE FORMOSA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '319', 'descripcion' => 'BANCO CMF S.A.', 'tipo' => 'Banco'],
            ['codigo' => '321', 'descripcion' => 'BANCO DE SANTIAGO DEL ESTERO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '322', 'descripcion' => 'BANCO INDUSTRIAL S.A.', 'tipo' => 'Banco'],
            ['codigo' => '330', 'descripcion' => 'NUEVO BANCO DE SANTA FE S.A.', 'tipo' => 'Banco'],
            ['codigo' => '331', 'descripcion' => 'BANCO CETELEM ARGENTINA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '332', 'descripcion' => 'BANCO DE SERVICIOS FINANCIEROS S.A.', 'tipo' => 'Banco'],
            ['codigo' => '336', 'descripcion' => 'BANCO BRADESCO ARGENTINA S.A.U.', 'tipo' => 'Banco'],
            ['codigo' => '338', 'descripcion' => 'BANCO DE SERVICIOS Y TRANSACCIONES S.A.', 'tipo' => 'Banco'],
            ['codigo' => '339', 'descripcion' => 'RCI BANQUE S.A.', 'tipo' => 'Banco'],
            ['codigo' => '340', 'descripcion' => 'BACS BANCO DE CREDITO Y SECURITIZACION S.A.', 'tipo' => 'Banco'],
            ['codigo' => '341', 'descripcion' => 'BANCO MASVENTAS S.A.', 'tipo' => 'Banco'],
            ['codigo' => '384', 'descripcion' => 'WILOBANK S.A.', 'tipo' => 'Banco'],
            ['codigo' => '386', 'descripcion' => 'NUEVO BANCO DE ENTRE RIOS S.A.', 'tipo' => 'Banco'],
            ['codigo' => '389', 'descripcion' => 'BANCO COLUMBIA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '426', 'descripcion' => 'BANCO BICA S.A.', 'tipo' => 'Banco'],
            ['codigo' => '431', 'descripcion' => 'BANCO COINAG S.A.', 'tipo' => 'Banco'],
            ['codigo' => '432', 'descripcion' => 'BANCO DE COMERCIO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '435', 'descripcion' => 'BANCO SUCREDITO REGIONAL S.A.U.', 'tipo' => 'Banco'],
            ['codigo' => '448', 'descripcion' => 'BANCO DINO S.A.', 'tipo' => 'Banco'],
            ['codigo' => '515', 'descripcion' => 'BANK OF CHINA LIMITED', 'tipo' => 'Banco'],

            //BILLETERAS / PSP (CVU)
            ['codigo' => '00000031', 'descripcion' => 'Mercado Pago', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000079', 'descripcion' => 'Ualá', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000045', 'descripcion' => 'Naranja X', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000063', 'descripcion' => 'Personal Pay', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000130', 'descripcion' => 'Prex', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000291', 'descripcion' => 'Nubi', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000216', 'descripcion' => 'Belo', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000234', 'descripcion' => 'Lemon Cash', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000062', 'descripcion' => 'Pluspagos', 'tipo' => 'Billetera Virtual'],
            ['codigo' => '00000277', 'descripcion' => 'Paymovil', 'tipo' => 'Billetera Virtual'],

            //FINANCIERAS DIGITALES (CBU)
            ['codigo' => '00000128', 'descripcion' => 'Brubank', 'tipo' => 'Financiera'],
            ['codigo' => '00000344', 'descripcion' => 'Openbank', 'tipo' => 'Financiera'],
            ['codigo' => '00000310', 'descripcion' => 'Banco del Sol', 'tipo' => 'Financiera'],
            ['codigo' => '00000322', 'descripcion' => 'Reba (Transatlántica)', 'tipo' => 'Financiera'],
        ];

        foreach ($entidades as $entidad) {
            EntidadFinanciera::create([
                'descripcion'           => $entidad['descripcion'],
                'tipo'                  => $entidad['tipo'] ?? 'Banco',
                'nacionalidad'          => $nacionalidadArgentina,
                'clave_unica'           => $entidad['codigo'],
                'habilitado'            => true,
                'fecha_creacion'        => now(),
                'usuario_creacion'      => $usuarioId,
                'fecha_actualizacion'   => null,
                'usuario_actualizacion' => null,
            ]);
        }
    }
}