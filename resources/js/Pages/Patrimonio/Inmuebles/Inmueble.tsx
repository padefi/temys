import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { InmuebleSchemaType, inmuebleSchema } from './InmuebleSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod"
import InformacionBasica from './InformacionBasica';
import Ubicacion from './Ubicacion';
import Caracteristicas from './Caracteristicas';
import TipoContrato from './TipoDeContrato';

function InmueblesForm() {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(inmuebleSchema),
    });

    console.log(errors)
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Inmuebles</h2>
            }>

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
                    <form className="space-y-6">

                        <InformacionBasica></InformacionBasica>
                        <Ubicacion></Ubicacion>
                        <Caracteristicas></Caracteristicas>
                        <TipoContrato></TipoContrato>

                    </form>
                </div>
            </div>


        </AuthenticatedLayout>
    )
}

{/*     <form
                onSubmit={handleSubmit((data)=>{

                    console.log(data)
                })}
            >
                <input {...register("num_partida")} type="number" />
                <div>
                <input {...register("email")} />
                 {errors.email && <p style={{ color: 'red' }}>{errors.email.message}</p>}
                </div>
                <button type='submit'>Enviar</button>
                
            </form> */}
export default InmueblesForm;