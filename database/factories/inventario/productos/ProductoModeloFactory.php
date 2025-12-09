<?php

namespace Database\Factories\Inventario\Productos;

use App\Models\ControlAcceso\User;
use App\Models\Inventario\Productos\ProductoMarca;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductoModeloFactory extends Factory
{
    public function definition(): array
    {
        // Listado de modelos reales por tipo de producto
        $modelos = [
            'Electrónica' => [
                'Samsung Galaxy A54', 'iPhone 13', 'Motorola Edge 40',
                'LG Smart TV 55" UHD', 'Sony WH-1000XM4', 'JBL Charge 5'
            ],
            'Informática' => [
                'Lenovo ThinkPad T480', 'HP Pavilion 15', 'Dell Inspiron 3511',
                'Logitech MX Master 3', 'Corsair K60 RGB Pro', 'Kingston NV2 1TB'
            ],
            'Hogar' => [
                'Philips Licuadora HR2222', 'Philips Hue A19', 'Xiaomi Mi Vacuum 2',
                'Oster Tostadora TSSTTRJBG1', 'Liliana Ventilador Turbo 3'
            ],
            'Ferretería' => [
                'B&D Taladro 13mm 710W', 'Bosch GSB 180-LI', 'Makita Amoladora 9557HPG',
                'Skil Sierra Circular 5280', 'Stanley Martillo STHT51346'
            ],
            'Oficina' => [
                'Silla Ergonomica ErgoPlus', 'Escritorio Turin 120cm', 'Monitor Samsung 24" FHD',
                'HP DeskJet 2775', 'Brother DCP-1602'
            ],
            'Higiene' => [
                'Cif Pro Multiuso', 'Ariel Power Pods', 'Lysoform Aerosol',
                'Elite Toallas Intercaladas', 'Procenex Piso Floral'
            ],
        ];

        // Elegir una categoría aleatoria
        $categoria = $this->faker->randomElement(array_keys($modelos));

        // Elegir un modelo real de esa categoría
        $modeloDescripcion = $this->faker->randomElement($modelos[$categoria]);

        // Marca y usuario
        $marca = ProductoMarca::inRandomOrder()->first() ?? ProductoMarca::factory()->create();
        $user = User::inRandomOrder()->first() ?? User::factory()->create();

        return [
            'descripcion'         => $modeloDescripcion,
            'marca_id'            => $marca->id,
            'fecha_creacion'      => now(),
            'usuario_creacion'    => $user->id,
            'fecha_actualizacion' => now(),
            'usuario_actualizacion' => $user->id,
        ];
    }
}
