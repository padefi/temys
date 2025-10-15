
import { Button } from '@/components/ui/button'; 
import { defineStepper } from '@stepperize/react';
import { DatosInmuebles } from './datosInmuebles';
import { DomicilioInmueble } from './domicilioInmueble';
import { ContactoInmueble } from './contactoInmueble';
import { DatosExtraInmueble } from './datosExtraInmueble';
import { useForm, FormProvider } from "react-hook-form";
import { Separator } from '@/Components/ui/separator';
import React, { use } from 'react';


const { useStepper, steps, utils } = defineStepper(
  {
    id: 'datosInmueble', title: 'Datos Inmueble', description: 'Datos del inmueble',
  },
 /*  {
    id: 'domicilioInmueble', title: 'domicilioInmueble', description: 'Datos del domicilio de inmueble',
  }, */
  {
    id: 'contactoInmueble', title: 'Contacto Inmueble', description: 'Datos de contacto inmuebles'
  },
  {
    id: 'extra', title: 'extra', description: 'Datos de superficie y tipo de contrato'
  },
);
const onSubmit = (data: any) => {
  console.log("Datos finales:", data);
  // acá podrías hacer:
  // post(route('register'), { data });
};

interface Contacto {
   
    tipo: string
    valor: string
    descripcion: string
}
export interface InmuebleFormData {
  num_partida: string
  estado_id: string
  nombre_completo: string
  nombre_fantasia: string
  tipo_inmueble_id: string
  tipo_ocupacion_id: string
  superficie_cubierta: string
  tipo_contrato:string
  superficie_libre: string
  superficie_total: string
  calle: string
  numero: string
  piso: string
  departamento:string
  codigo_postal: string
  localidad: string
  provincia: string
  contactos:Contacto[]

}
function App() {
  const stepper = useStepper();
  const form = useForm()

  const currentIndex = utils.getIndex(stepper.current.id);
  return (
    <div className="space-y-6 p-6 border rounded-lg ">
      {/* header de stepper */}
      <div className="flex justify-between">
        <h2 className="text-lg font-medium">Checkout</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Step {currentIndex + 1} of {steps.length}
          </span>
          <div />
        </div>
      </div>
    
      <nav aria-label="Checkout Steps" className="group my-4">
        <ol
          className="flex items-center justify-between gap-2"
          aria-orientation="horizontal"
        >
          {stepper.all.map((step, index, array) => (
            <React.Fragment key={step.id}>
              <li className="flex items-center gap-4 flex-shrink-0">
                <Button
                  type="button"
                  role="tab"
                  variant={index <= currentIndex ? 'default' : 'secondary'}
                  aria-current={
                    stepper.current.id === step.id ? 'step' : undefined
                  }
                  aria-posinset={index + 1}
                  aria-setsize={steps.length}
                  aria-selected={stepper.current.id === step.id}
                  className="flex size-10 items-center justify-center rounded-full"
                  onClick={() => stepper.goTo(step.id)}
                >
                  {index + 1}
                </Button>
                <span className="text-sm font-medium">{step.title}</span>
              </li>
              {index < array.length - 1 && (
                <Separator
                  className={`flex-1 ${
                    index < currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav> 


      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-7xl mx-auto">
          <div className="space-y-4">
            {stepper.switch({
              datosInmueble: () => <DatosInmuebles />,
              /* domicilioInmueble: () => <DomicilioInmueble />, */
              contactoInmueble: () => <ContactoInmueble />,
              extra: () => <DatosExtraInmueble />,
            })}
            {!stepper.isLast ? (
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                >
                  Back
                </Button>
                <Button onClick={stepper.next}>
                  {stepper.isLast ? 'Complete' : 'Next'}
                </Button>
              </div>
            ) : (
              <>
                     <Button /* onClick={stepper.reset} */ type='submit'>enviar</Button>
              <Button  onClick={stepper.reset} >reset</Button>
              </>
       
            )}
          </div>

        </form>
      </FormProvider>
    </div>
  );
}



export default App;

