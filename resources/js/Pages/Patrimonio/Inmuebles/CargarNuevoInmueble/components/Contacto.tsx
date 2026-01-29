import { useEffect, useState } from "react"
import axios from "axios"
import { Plus, Trash2, Phone, NotebookTabs } from "lucide-react"
import { Button } from "@/Components/ui/button"
import { Input } from "@/Components/ui/input"
import { Textarea } from "@/Components/ui/textarea"
import { Label } from "@/Components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card"
import { SelectOption } from "@/types/Patrimonio/Inmuebles"
import { useFormContext } from "react-hook-form"
import { InmuebleSchemaType } from "../Schema/InmuebleSchema"
import { ContactoType } from "../Schema/ContactoSchema"

const generateId = () =>
    Math.random().toString(36).substring(2, 9)

const placeholderByLabel = (label?: string) => {
    switch (label?.toLowerCase()) {
        case "email":
            return "ejemplo@correo.com"
        case "teléfono":
            return "+54 11 1234-5678"
        case "celular":
            return "+54 9 11 1234-5678"
        default:
            return "Ingrese el contacto"
    }
}

export function Contacto() {
    const {
        setValue,
        watch,
        formState: { errors },
    } = useFormContext<InmuebleSchemaType>();
    
    const formContacts = watch("contactos") || [];
    
    const [contacts, setContacts] = useState<ContactoType[]>(() =>
        formContacts.map(contact => ({
            ...contact,
            id: contact.id || generateId()
        }))
    );
    
    const [contactTypes, setContactTypes] = useState<SelectOption[]>([])
    
    const [newContact, setNewContact] = useState<Omit<ContactoType, "id">>({
        idType: 0,
        value: "",
        description: "",
    })

    useEffect(() => {
        axios
            .get("/patrimonio/inmuebles/tipos-contacto")
            .then(res => {
                setContactTypes(
                    res.data.map((item: any) => ({
                        value: String(item.id),
                        label: item.descripcion,
                    }))
                );
            })
            .catch(err =>
                console.error("Error fetching contact types", err)
            )
    }, [])

    // Sincroniza el estado local con React Hook Form
    useEffect(() => {
        setValue("contactos", contacts, { shouldValidate: true });
    }, [contacts, setValue]);

    const selectedType = contactTypes.find(
        t => Number(t.value) === newContact.idType
    )

    const handleAddContact = () => {
        if (!newContact.value.trim() || newContact.idType === 0) return

        setContacts(prev => [
            ...prev,
            { ...newContact, id: generateId() },
        ])

        setNewContact({
            idType: 0,
            value: "",
            description: "",
        })
    }

    const handleRemoveContact = (id: string) => {
        setContacts(prev =>
            prev.filter(contact => contact.id !== id)
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <NotebookTabs className="h-5 w-5 text-primary" />
                    Información de Contacto
                </CardTitle>
                <CardDescription>
                    Agrega múltiples formas de contacto
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {/* Formulario */}
                <div className="space-y-4 rounded-lg border border-dashed p-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Tipo de contacto</Label>
                            <Select
                                value={newContact.idType === 0 ? "" : String(newContact.idType)}
                                onValueChange={(value) =>
                                    setNewContact(prev => ({
                                        ...prev,
                                        idType: Number(value),
                                    }))
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un tipo" />
                                </SelectTrigger>
                                <SelectContent>
                                    {contactTypes.map(type => (
                                        <SelectItem
                                            key={type.value}
                                            value={type.value}
                                        >
                                            {type.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>Contacto</Label>
                            <Input
                                placeholder={placeholderByLabel(
                                    selectedType?.label
                                )}
                                value={newContact.value}
                                onChange={(e) =>
                                    setNewContact(prev => ({
                                        ...prev,
                                        value: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Descripción (opcional)</Label>
                        <Textarea
                            rows={2}
                            value={newContact.description || ""}
                            onChange={(e) =>
                                setNewContact(prev => ({
                                    ...prev,
                                    description: e.target.value,
                                }))
                            }
                        />
                    </div>

                    <Button
                        type="button"
                        onClick={handleAddContact}
                        disabled={
                            !newContact.value.trim() ||
                            newContact.idType === 0
                        }
                    >
                        <Plus className="mr-2 size-4" />
                        Agregar contacto
                    </Button>
                </div>

                {/* Mensaje de error de validación */}
                {errors.contactos && (
                    <p className="text-sm text-destructive">
                        {errors.contactos.message}
                    </p>
                )}

                {/* Lista */}
                {contacts.length > 0 ? (
                    <div className="space-y-2">
                        {contacts.map(contact => {
                            const type = contactTypes.find(
                                t => Number(t.value) === contact.idType
                            )

                            return (
                                <div
                                    key={contact.id}
                                    className="flex items-start justify-between rounded-lg border p-4"
                                >
                                    <div>
                                        <p className="text-xs uppercase text-muted-foreground">
                                            {type?.label}
                                        </p>
                                        <p className="font-medium">
                                            {contact.value}
                                        </p>
                                        {contact.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {contact.description}
                                            </p>
                                        )}
                                    </div>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            handleRemoveContact(contact.id!)
                                        }
                                    >
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        <Phone className="mx-auto mb-2 size-8 opacity-50" />
                        <p>No hay contactos agregados</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}