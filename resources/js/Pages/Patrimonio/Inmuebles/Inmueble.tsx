import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { inmuebleSchema, InmuebleSchemaType } from './InmuebleSchema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InformacionBasica from './InformacionBasica';
import Caracteristicas from './Caracteristicas';
import TiposDeContratos from './Contratos';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { MapPin } from 'lucide-react';
import { Button } from '@/Components/ui/button';
import { tipocontrato, estadoInmueble } from './InmuebleSchema';
import BuscadorDireccionesCompacto from '@/Components/BuscadorDirecciones';
import axios from 'axios';
function InmueblesForm() {
    const methods = useForm<InmuebleSchemaType>({
        resolver: zodResolver(inmuebleSchema) as any,
        mode: 'onBlur', // Cambiado a onBlur para validar al salir del campo
        defaultValues: {
            num_partida: "" as any,
            tipo_ocupacion_id: "" as any,
            estado_id: "" as any,
            tipo_contrato: "" as any,
            nombre_fantasia: "",
            nombre_completo: "",
            tipo_inmueble_id: "" as any,
            calle_id: "",
            numero: "" as any,
            superficie_cubierta: "" as any,
            superficie_libre: "" as any,
            superficie_total: "" as any,
            fecha_inscripcion: '',
            fecha_escritura: '',
            fecha_contrato: '',
            fecha_inicio: '',
            fecha_fin: '',
            importe: "" as any,
            num_escritura: "" as any,
            folio: "" as any,
            tomo: "" as any,
            observacion: "",
        }
    });

    const {
        formState: { isValid, isSubmitting },
        setValue,
        trigger,
    } = methods;

    const onSubmit = async (data: InmuebleSchemaType) => {
        await axios.post('/patrimonio/inmuebles/create-inmueble', data)
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Inmuebles
                </h2>
            }
        >
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                            Cargar Nuevo Inmueble
                        </h1>
                        <p className="mt-3 text-pretty text-lg text-muted-foreground">
                            Complete el formulario con los datos de la propiedad
                        </p>
                    </div>

                    <FormProvider {...methods}>
                        <form className="space-y-6" onSubmit={methods.handleSubmit(onSubmit)}>
                            <InformacionBasica />
                            {/* <Ubicacion /> */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Ubicación
                                    </CardTitle>
                                    <CardDescription>Dirección y localización de la propiedad</CardDescription>
                                </CardHeader>
                                <BuscadorDireccionesCompacto mostrarBorde={true} onDireccionSeleccionada={(direccion) => {
                                    setValue('calle_id', direccion.calle_id, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                    setValue('numero', direccion.altura, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });

                                    console.log('DIRECCION SELECCIONADA EN FORM:', direccion);
                                    // Si querés validar inmediatamente
                                    trigger('calle_id');
                                }}></BuscadorDireccionesCompacto>
                            </Card>

                            <Caracteristicas />
                            <TiposDeContratos />


                            <Button
                                type="submit"
                                className="w-full h-11 rounded-full hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                size="lg"
                                disabled={!isValid || isSubmitting}
                            >
                                {isSubmitting ? "Ingresando..." : "Ingresar"} 
                            </Button>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default InmueblesForm;