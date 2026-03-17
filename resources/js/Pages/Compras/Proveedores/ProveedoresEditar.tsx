import { PropsWithChildren, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useForm } from '@inertiajs/react'; // Importar useForm
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Proveedor, ProveedoresEditarProps, TipoDocumento } from "@/types/Proveedor";
import TextInput from '@/Components/TextInput';
import { Label } from '@/Components/ui/label';
import { Button } from "@/Components/ui/button"
import { toast } from "sonner";

const tiposDocumento: { value: TipoDocumento; label: string }[] = [
    { value: 'CUIT', label: 'CUIT' },
];

export function ProveedoresEditar({ open, setOpen, proveedor }: PropsWithChildren<ProveedoresEditarProps>) {

    // Usar useForm de Inertia en lugar de useState
    const { data, setData, put, processing, errors } = useForm<Record<string, any>>(proveedor);

    // Función para actualizar el padron
    const handlePadronChange = <T extends keyof Proveedor['padron']>(field: T, value: Proveedor['padron'][T]) => {
        setData('padron', {
            ...data.padron,
            [field]: value
        });
    };

    // Función para actualizar otros campos
    const handleChange = <T extends keyof Proveedor>(field: T, value: Proveedor[T]) => {
        setData(field as string, value as string | number);
    };

    // Efecto para sincronizar cuando cambia el proveedor
    useEffect(() => {
        if (open) {
            setData(proveedor);
        }
    }, [open, proveedor]);

    // Manejo del envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!data.razon_social.trim() || !data.padron.documento.trim()) {
            toast.error('Los campos obligatorios deben estar completos');
            return;
        }

        put(`/compras/proveedores/${data.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Proveedor actualizado correctamente');
                setOpen(false);
            },
            onError: (e) => {
                console.log(e);

                toast.error('Error al actualizar el proveedor');
            }
        });
    };

        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[95vw] sm:max-w-[80vw] md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[50vw] max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle>
                            Datos del proveedor
                            <strong className="text-amber-500"> {proveedor.razon_social}</strong>
                        </DialogTitle>
                        <DialogDescription>
                            <span className="font-semibold">Edición del proveedor.</span>
                        </DialogDescription>
                    </DialogHeader>

                    <Tabs defaultValue="datos-basicos" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="datos-basicos">Datos Básicos</TabsTrigger>
                            <TabsTrigger value="contabilidad">Contabilidad</TabsTrigger>
                        </TabsList>

                        {/* Tab 1 - Formulario actual */}
                        <TabsContent value="datos-basicos">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Label className="LabelRoot">
                                        Razón Social
                                    </Label>
                                    <TextInput
                                        id="razon_social"
                                        type="text"
                                        name="razon_social"
                                        value={data.razon_social}
                                        className="mt-1 block w-full"
                                        onChange={(e) => handleChange('razon_social', e.target.value)}
                                        autoComplete="off"
                                        isFocused={true}
                                    />

                                    <Label className="LabelRoot">
                                        Nombre Fantasia
                                    </Label>
                                    <TextInput
                                        id="nombre_fantasia"
                                        type="text"
                                        name="nombre_fantasia"
                                        value={data.nombre_fantasia}
                                        className="mt-1 block w-full"
                                        onChange={(e) => handleChange('nombre_fantasia', e.target.value)}
                                        autoComplete="off"
                                    />

                                    <Label className="LabelRoot">
                                        Tipo de Documento
                                    </Label>
                                    <Select
                                        value={data.padron.tipo_documento}
                                        onValueChange={(value: TipoDocumento) => handlePadronChange('tipo_documento', value)}
                                    >
                                        <SelectTrigger variant="filled" className="w-full">
                                            <SelectValue placeholder="Tipo de documento" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Tipos de Documento</SelectLabel>
                                                {tiposDocumento.map((tipo) => (
                                                    <SelectItem key={tipo.value} value={tipo.value}>
                                                        {tipo.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <Label className="LabelRoot">
                                        Documento
                                    </Label>
                                    <TextInput
                                        id="documento"
                                        type="text"
                                        name="documento"
                                        value={data.padron.documento}
                                        className="mt-1 block w-full"
                                        onChange={(e) => handlePadronChange('documento', e.target.value)}
                                        autoComplete="off"
                                    />
                                    {errors['padron.documento'] && (
                                        <p className="text-red-500 text-sm mt-1">{errors['padron.documento']}</p>
                                    )}
                                </div>

                                <DialogFooter className="gap-3 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setOpen(false)}
                                        className="w-full sm:w-auto"
                                        type="button"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full sm:w-auto"
                                    >
                                        {processing ? 'Guardando...' : 'Guardar Cambios'}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </TabsContent>

                        {/* Tab 2 - Contabilidad (a implementar) */}
                        <TabsContent value="contabilidad">
                            <div className="p-4 border rounded-lg">
                                <h3 className="text-lg font-medium mb-4">Contabilidad</h3>
                                <p className="text-gray-500">
                                    Esta sección estará disponible próximamente. Aquí podrás:
                                </p>
                                <ul className="list-disc pl-5 mt-2 text-gray-500">
                                    <li>Agregar datos de contacto adicionales</li>
                                    <li>Gestionar información bancaria</li>
                                    <li>Configurar condiciones comerciales</li>
                                </ul>
                            </div>
                        </TabsContent>
                    </Tabs>
                </DialogContent>
            </Dialog>
        );
    }

