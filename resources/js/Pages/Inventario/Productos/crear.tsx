import { Head, router } from '@inertiajs/react';
import { useState, FormEvent } from 'react';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Card, CardContent } from '@/Components/ui/card';
import { Label } from '@/Components/ui/label';
import { Checkbox } from '@/Components/ui/checkbox';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function CrearProducto() {
    const [form, setForm] = useState({
        nombre: '',
        descripcion: '',
        modelo_id: '',
        subcategoria_id: '',
        peso: '',
        alto: '',
        ancho: '',
        profundidad: '',
        cod_barras: '',
        referencia: '',
        es_inventario: false,
        es_patrimonio: false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.post(route('productosInventario.store'), form);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Crear Producto" />
            <div className="max-w-3xl mx-auto p-4">
                <Card>
                    <CardContent className="p-6 space-y-4">
                        <h2 className="text-xl font-semibold">Crear Producto</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <Label>Nombre</Label>
                                <Input name="nombre" value={form.nombre} onChange={handleChange} required />
                            </div>
                            <div className="col-span-2">
                                <Label>Descripción</Label>
                                <Input name="descripcion" value={form.descripcion} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Modelo ID</Label>
                                <Input name="modelo_id" value={form.modelo_id} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Subcategoría ID</Label>
                                <Input name="subcategoria_id" value={form.subcategoria_id} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Peso</Label>
                                <Input name="peso" value={form.peso} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Alto</Label>
                                <Input name="alto" value={form.alto} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Ancho</Label>
                                <Input name="ancho" value={form.ancho} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Profundidad</Label>
                                <Input name="profundidad" value={form.profundidad} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Código de Barras</Label>
                                <Input name="cod_barras" value={form.cod_barras} onChange={handleChange} />
                            </div>
                            <div>
                                <Label>Referencia</Label>
                                <Input name="referencia" value={form.referencia} onChange={handleChange} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="es_inventario"
                                    checked={form.es_inventario}
                                    onCheckedChange={checked => handleChange({ target: { name: 'es_inventario', checked, type: 'checkbox' } } as any)}
                                />
                                <Label htmlFor="es_inventario">¿Es Inventario?</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    id="es_patrimonio"
                                    checked={form.es_patrimonio}
                                    onCheckedChange={checked => handleChange({ target: { name: 'es_patrimonio', checked, type: 'checkbox' } } as any)}
                                />
                                <Label htmlFor="es_patrimonio">¿Es Patrimonio?</Label>
                            </div>
                            <div className="col-span-2">
                                <Button type="submit" className="w-full">Guardar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}