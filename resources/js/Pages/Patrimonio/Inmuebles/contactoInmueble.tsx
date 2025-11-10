import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Plus, X } from "lucide-react";

import { useFormContext, useFieldArray } from "react-hook-form";
import { InmuebleFormData } from "@/types/Inmuebles";

export function ContactoInmueble() {
    const { control, register, setValue, watch } = useFormContext<InmuebleFormData>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "contactos", // Debe existir en InmuebleFormData
    });

    const agregarContacto = () => {
        append({ tipo: "telefono", valor: "", descripcion: "" });
    };

    return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-3 pb-4 border-b-2 border-border">
                    <div>
                        <h2 className="text-xl font-bold text-secondary uppercase tracking-wide">
                            Información de Contacto
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Agregue uno o más medios de contacto
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <Card key={field.id} className="border-2 border-border bg-muted/30 p-4">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Tipo de contacto */}
                                    <div className="space-y-2">
                                        <Label className="text-secondary font-semibold uppercase text-xs">
                                            Tipo de Contacto
                                        </Label>
                                        <Select
                                            value={watch(`contactos.${index}.tipo`)}
                                            onValueChange={(value) => setValue(`contactos.${index}.tipo`, value)}
                                        >
                                            <SelectTrigger className="border-2 border-secondary bg-input text-foreground h-12">
                                                <SelectValue placeholder="Seleccione el tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="telefono">Teléfono</SelectItem>
                                                <SelectItem value="celular">Celular</SelectItem>
                                                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                                <SelectItem value="email">Email</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {/* Valor */}
                                    <div className="space-y-2">
                                        <Label className="text-secondary font-semibold uppercase text-xs">
                                            {watch(`contactos.${index}.tipo`) === "email" ? "Email" : "Número"}
                                        </Label>
                                        <Input
                                            type={watch(`contactos.${index}.tipo`) === "email" ? "email" : "tel"}
                                            placeholder={watch(`contactos.${index}.tipo`) === "email"
                                                ? "ejemplo@correo.com"
                                                : "+54 11 1234-5678"
                                            }
                                            {...register(`contactos.${index}.valor`)}
                                            className="border-2 border-secondary bg-input text-foreground h-12"
                                        />
                                    </div>

                                    {/* Descripción */}
                                    <div className="space-y-2">
                                        <Label className="text-secondary font-semibold uppercase text-xs">
                                            Descripción
                                        </Label>
                                        <Input
                                            placeholder="Ej: Contacto principal"
                                            {...register(`contactos.${index}.descripcion`)}
                                            className="border-2 border-secondary bg-input text-foreground h-12"
                                        />
                                    </div>
                                </div>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => remove(index)}
                                        className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-7"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </Card>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={agregarContacto}
                        className="w-full border-2 border-dashed border-secondary text-secondary hover:bg-secondary/10 h-12 bg-transparent"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Agregar otro contacto
                    </Button>
                </div>

                <div className="bg-muted border-2 border-border p-4 rounded">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Nota:</span> Puede agregar múltiples formas de contacto. Al
                        menos un contacto debe tener un valor ingresado.
                    </p>
                </div>
            </div>

    );
}
