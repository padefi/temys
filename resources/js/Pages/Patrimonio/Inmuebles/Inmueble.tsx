import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { inmuebleSchema, InmuebleSchemaType } from './InmuebleSchema';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import InformacionBasica from './InformacionBasica';
import Ubicacion from './Ubicacion';
import Caracteristicas from './Caracteristicas';
import TiposDeContratos from './Contratos';
import BuscadorDireccionesCompacto from '@/Components/BuscadorDirecciones';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { MapPin, MapPinCheck } from 'lucide-react';

function InmueblesForm() {
    const methods = useForm<InmuebleSchemaType>({
        resolver: zodResolver(inmuebleSchema) as any,
        mode: 'onSubmit', // podés cambiar a onBlur / onChange si querés
    });

    const onSubmit = (data: InmuebleSchemaType) => {
        console.log('DATA FORM:', data);
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
                        <form
                            className="space-y-6"
                            onSubmit={methods.handleSubmit(onSubmit)}
                            noValidate
                        >
                            <InformacionBasica />
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-primary" />
                                        Ubicación
                                    </CardTitle>
                                    <CardDescription>Dirección y localización de la propiedad</CardDescription>
                                </CardHeader>
                                <BuscadorDireccionesCompacto mostrarBorde={true} onDireccionSeleccionada={(e => { })}></BuscadorDireccionesCompacto>
                            </Card>

                            {/*     <Ubicacion /> */}
                            <Caracteristicas />
                            <TiposDeContratos />

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="rounded-md bg-primary px-4 py-2 text-white"
                                >
                                    Enviar
                                </button>
                            </div>
                        </form>
                    </FormProvider>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default InmueblesForm;
