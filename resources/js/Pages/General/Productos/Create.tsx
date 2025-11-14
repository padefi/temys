import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Checkbox } from "@/Components/ui/checkbox";
import { Textarea } from "@/Components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState } from 'react';
import axios from 'axios';
import SearchableSelect from "@/Components/SearchableSelect";




export default function Create({ producto }: { producto?: any }) {

  const { modulo } = usePage().props as any;
  const { data, setData, post, put, processing, errors } = useForm({
    nombre: producto?.nombre ?? "",
    descripcion: producto?.descripcion ?? "",
    modelo_id: producto?.modelo_id ?? "",
    subcategoria_id: producto?.subcategoria_id ?? "",
    peso: producto?.peso ?? "",
    alto: producto?.alto ?? "",
    ancho: producto?.ancho ?? "",
    volumen: producto?.volumen ?? "",
    profundidad: producto?.profundidad ?? "",
    cod_barras: producto?.cod_barras ?? "",
    es_inventario: producto?.es_inventario ?? false,
    es_patrimonio: producto?.es_patrimonio ?? false,
    referencia: producto?.referencia ?? "",
    co_cuenta_id: producto?.co_cuenta_id ?? "",
    });

    const [cuentas, setCuentas] = useState<any[]>([]);
    const [subCategorias, setSubCategorias] = useState<any[]>([]);
    const [modelos, setModelos] = useState<any[]>([]);
    const [loadingCuentas, setLoadingCuentas] = useState(false);
    const [loadingModelos, setLoadingModelos] = useState(false);
    const [loadingSubCategorias, setLoadingSubCategorias] = useState(false);

    useEffect(() => {
        loadCuentas();
        loadSubCategorias();
        loadModelos();
    }, []);

    const loadCuentas = async () => {
    if (cuentas.length) return;
    setLoadingCuentas(true);
    const res = await axios.get('/cuentas-contables');
    setCuentas(Array.isArray(res.data) ? res.data : res.data.data || []);
    setLoadingCuentas(false);
    };

    const loadSubCategorias = async () => {
    if (subCategorias.length) return;
    setLoadingSubCategorias(true);
    const res = await axios.get('/subcategorias');
    setSubCategorias(Array.isArray(res.data) ? res.data : res.data.data || []);
    setLoadingSubCategorias(false);
    };

    const loadModelos = async () => {
    if (modelos.length) return;
    setLoadingModelos(true);
    const res = await axios.get('/modelos');
    setModelos(Array.isArray(res.data) ? res.data : res.data.data || []);
    setLoadingModelos(false);
    };


    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (producto) {
            // EDITAR
            put(`/compras/productos/${producto.id}`, {
                onSuccess: () => toast.success("Producto actualizado correctamente"),
                onError: () => toast.error("Error al actualizar producto"),
            });
        } else {
            // CREAR
            post(`/compras/productos`, {
                onSuccess: () => toast.success("Producto creado correctamente"),
                onError: () => toast.error("Error al crear producto"),
            });
        }
    };


  return (
    <AuthenticatedLayout
    header={
        <h2 className="text-xl font-semibold text-gray-800">
        {producto ? "Editar Producto" : "Nuevo Producto"}
        </h2>
    }
    >
      <Head title="Nuevo Producto" />
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow space-y-6 mt-6">
        <Button onClick={() => router.get(route('productos.index'))} className="w-full">Volver</Button>

      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-6 rounded-md shadow space-y-6 mt-6"
      >


        {/* Nombre */}
        <div>
          <Label>Nombre *</Label>
          <Input value={data.nombre} onChange={(e) => setData("nombre", e.target.value)} />
          {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre}</p>}
        </div>

        {/* Descripción */}
        <div>
          <Label>Descripción</Label>
          <Textarea value={data.descripcion} onChange={(e) => setData("descripcion", e.target.value)} />
        </div>

        {/* Modelo */}
        <div>
        <Label>Modelo</Label>
        <SearchableSelect
        value={data.modelo_id}
        placeholder="Seleccionar modelo"
        options={modelos.map((m) => ({
            id: m.id,
            label: m.descripcion,
            keywords: [m.descripcion],
        }))}
        loading={loadingModelos}
        onChange={(v) => setData("modelo_id", v)}
        onOpen={loadModelos}
        />


        </div>

        {/* Subcategoría */}
        <div>
        <Label>Subcategoría</Label>
        <SearchableSelect
        value={data.subcategoria_id}
        placeholder="Seleccionar subcategoría"
        options={subCategorias.map((s) => ({
            id: s.id,
            label: s.descripcion,
            keywords: [s.descripcion],
        }))}
        loading={loadingSubCategorias}
        onChange={(v) => setData("subcategoria_id", v)}
        onOpen={loadSubCategorias}
        />


        </div>

        {/* Cuenta Contable */}
        <div>
        <Label>Cuenta Contable</Label>
        <SearchableSelect
        value={data.co_cuenta_id}
        placeholder="Seleccionar cuenta"
        options={cuentas.map((c) => ({
            id: c.id,
            label: `${c.codigo} - ${c.descripcion}`,
            keywords: [c.codigo, c.descripcion],
        }))}
        loading={loadingCuentas}
        onChange={(v) => setData("co_cuenta_id", v)}
        onOpen={loadCuentas}
        />


        </div>


        {/* Dimensiones */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Peso (Kg)</Label>
            <Input type="number" value={data.peso} onChange={(e) => setData("peso", e.target.value)} />
          </div>
          <div>
            <Label>Volumen (M3)</Label>
            <Input type="number" value={data.volumen} onChange={(e) => setData("volumen", e.target.value)} />
          </div>
          <div>
            <Label>Referencia</Label>
            <Input value={data.referencia} onChange={(e) => setData("referencia", e.target.value)} />
          </div>
        </div>

        {/* Medidas */}
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Alto (M)</Label>
            <Input type="number" value={data.alto} onChange={(e) => setData("alto", e.target.value)} />
          </div>
          <div>
            <Label>Ancho (M)</Label>
            <Input type="number" value={data.ancho} onChange={(e) => setData("ancho", e.target.value)} />
          </div>
          <div>
            <Label>Profundidad (M)</Label>
            <Input type="number" value={data.profundidad} onChange={(e) => setData("profundidad", e.target.value)} />
          </div>
        </div>

        {/* Código de barras */}
        <div>
          <Label>Código de barras</Label>
          <Input value={data.cod_barras} onChange={(e) => setData("cod_barras", e.target.value)} />
        </div>

        {/* Checkboxes */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Checkbox checked={data.es_inventario} onCheckedChange={(v) => setData("es_inventario", !!v)} />
            <Label>Es inventario</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox checked={data.es_patrimonio} onCheckedChange={(v) => setData("es_patrimonio", !!v)} />
            <Label>Es patrimonio</Label>
          </div>
        </div>

        {/* Botón */}
        <Button type="submit" disabled={processing} className="w-full">
          Guardar producto
        </Button>
      </form>
      </div>
    </AuthenticatedLayout>
  );
}
