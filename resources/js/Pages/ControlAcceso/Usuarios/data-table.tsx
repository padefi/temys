"use client";

import { ColumnDef, flexRender, getCoreRowModel, getFilteredRowModel, useReactTable, CellContext } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { DataTableSkeleton } from "./data-table-skeleton";
import { useDataTableParams } from "@/hooks/useDataTableParams";
import { RowActions } from "./row-actions";
import { Role, User } from "./page";
import { toast } from "sonner";
import { isEmpty, isUndefined, validateEmail } from "@/utils/validateFunctions";
import { RowEditable } from "./row-editable";
import { Footer } from "./footer";
import { links } from "@/types/links";
import { meta } from "@/types/meta";
import axios from "axios";


interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    links: links;
    meta: meta;
    roles: Array<{ id: number; name: string }>;
    newUser: boolean;
    setNewUser: (newUser: boolean) => void;
    editingNewUserIndex: number | null;
    cancelCreateUser: () => void;
    editingUserIndex: number | null;
    setEditingUserIndex: (idx: number | null) => void;
}

export function DataTable<TData extends User, TValue>({
    columns: initialColumns,
    data: initialData,
    links,
    meta,
    roles,
    newUser,
    setNewUser,
    editingNewUserIndex,
    cancelCreateUser,
    editingUserIndex,
    setEditingUserIndex,
}: DataTableProps<TData, TValue>) {
    const { params, updateParams, isLoading } = useDataTableParams();
    const [tableData, setTableData] = useState<TData[]>(initialData);
    const [loadingSaving, setLoadingSaving] = useState(false);

    const editUserDataRef = useRef<Partial<User>>({});
    const validationErrors = useRef(false);
    const footerRef = useRef<{ goToPage: (pageLink: string | null) => void }>(null);

    useEffect(() => {
        setTableData(initialData);
        setEditingUserIndex(null);
        editUserDataRef.current = {};
        setLoadingSaving(false);
    }, [initialData]);

    useEffect(() => {
        if (newUser && footerRef.current) {
            footerRef.current.goToPage(links.last);
        }
    }, [newUser, links.last]);

    useEffect(() => {
        if (editingNewUserIndex !== null) {
            setEditingUserIndex(editingNewUserIndex);
            editUserDataRef.current = {
                name: "",
                last_name: "",
                email: "",
                roles: [],
            };
        }
    }, [editingNewUserIndex]);

    const handleUserUpdate = useCallback((updatedUser: User) => {
        const userId = newUser ? 0 : updatedUser.id;

        setTableData(prevData =>
            prevData.map(user => (user.id === userId ? (updatedUser as TData) : user))
        );
    }, [newUser]);

    const handleSaveInlineEdit = useCallback(async (userToSave: User) => {
        validationErrors.current = false;

        Object.keys(editUserDataRef.current).forEach(_key => {
            const key = _key as keyof User;
            const data = Array.isArray(editUserDataRef.current[key]) ? editUserDataRef.current[key][0]?.name : editUserDataRef.current[key];

            if (isUndefined(data) || isEmpty(data) || (key === 'email' && !validateEmail(data))) {
                validationErrors.current = true;
            }
        });

        if (validationErrors.current) {
            toast.error("Por favor, corrija los errores antes de guardar.");
            return;
        }

        setLoadingSaving(true);
        const currentEditData = editUserDataRef.current;
        const role = currentEditData.roles && !Array.isArray(currentEditData.roles) ? currentEditData.roles : userToSave.roles?.[0]?.name.toLowerCase() ?? "";

        const dataToSendToBackend = {
            id: userToSave.id,
            name: currentEditData.name ?? userToSave.name,
            last_name: currentEditData.last_name ?? userToSave.last_name,
            email: currentEditData.email?.toLowerCase() ?? userToSave.email.toLowerCase(),
            role: role,
        };

        try {
            const response = newUser
                ? await axios.post("/control-acceso/store-user", dataToSendToBackend)
                : await axios.put(`/control-acceso/edit-user/${userToSave.id}`, dataToSendToBackend);
            const data = response.data;

            if (!data.success) {
                toast.error(data.message);
                return;
            }

            toast.success(data.message);

            const finalUpdatedUser: User = {
                ...userToSave,
                ...data.user,
            };

            handleUserUpdate(finalUpdatedUser);
            setNewUser(false);
            setEditingUserIndex(null);
            editUserDataRef.current = {};
            validationErrors.current = false;
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                toast.error(error.response.data.message || "Error desconocido del servidor");
            } else {
                toast.error("Error al editar el usuario");
            }
        } finally {
            setLoadingSaving(false);
        }
    }, [handleUserUpdate, roles, newUser]);

    const handleCancelInlineEdit = useCallback(() => {
        if (newUser) cancelCreateUser();

        setEditingUserIndex(null);
        editUserDataRef.current = {};
        setLoadingSaving(false);
        validationErrors.current = false;
    }, [newUser]);

    const handleCellInputChange = useCallback((columnId: keyof User, value: string) => {
        editUserDataRef.current = {
            ...editUserDataRef.current,
            [columnId]: value,
        };
    }, []);

    const columns = useMemo(() => {
        return initialColumns.map(col => {
            return {
                ...col,
                cell: ({ getValue, row: { index, original }, column, table }: CellContext<TData, TValue>) => {
                    const isCurrentlyEditing = editingUserIndex === index;
                    const cellValue = getValue();
                    const initialCellOriginalValue = Array.isArray(cellValue)
                        ? (cellValue[0] as { name: string })?.name as string ?? "SIN ROL"
                        : (cellValue as string);

                    if (!isCurrentlyEditing) {
                        if (col.id === 'roles') {
                            return (
                                <div>
                                    <span className={`
                                    ${(initialCellOriginalValue === 'admin')
                                            ? 'text-emerald-700'
                                            : initialCellOriginalValue === 'SIN ROL'
                                                ? 'text-red-500'
                                                : ''
                                        } text-sm`}>{initialCellOriginalValue}</span>
                                </div>
                            );
                        } else if (col.id === 'actions') {
                            return (
                                <RowActions
                                    user={original as User}
                                    onUserUpdate={handleUserUpdate}
                                    onEditClick={() => {
                                        setEditingUserIndex(index);
                                        editUserDataRef.current = {
                                            name: original.name,
                                            last_name: original.last_name,
                                            email: original.email,
                                            roles: original.roles ? [...original.roles] : [],
                                        };
                                    }}
                                    isEditing={editingUserIndex === index}
                                    hasValidationErrors={validationErrors.current}
                                    disabled={loadingSaving || newUser || editingUserIndex !== null}
                                />
                            );
                        }

                        return cellValue;
                    } else {
                        let currentEditedValueForThisCell = editUserDataRef.current[column.id as keyof User];
                        if (Array.isArray(currentEditedValueForThisCell)) {
                            currentEditedValueForThisCell = currentEditedValueForThisCell[0]?.name ?? "";
                        }

                        const valueToPassToRowEditable = isCurrentlyEditing && currentEditedValueForThisCell !== undefined
                            ? currentEditedValueForThisCell
                            : col.id === 'actions' ? '' : initialCellOriginalValue;

                        const rolesData: Role[] = (table.options.meta as { roles: Role[] })?.roles || [];
                        const selectOptions = rolesData.map(role => ({
                            label: role.name.toUpperCase(),
                            value: role.name.toUpperCase(),
                        }));

                        return (
                            <RowEditable
                                user={original as User}
                                type={column.columnDef.meta?.type || 'text'}
                                label={column.columnDef.meta?.label || ''}
                                initialValue={(valueToPassToRowEditable as string).toUpperCase()}
                                selectData={selectOptions}
                                columnId={column.id as keyof User}
                                onValueChange={handleCellInputChange}
                                onSaveInlineEdit={handleSaveInlineEdit}
                                onCancelInlineEdit={handleCancelInlineEdit}
                                disabled={loadingSaving}
                            />
                        );
                    }
                },
            }
        });
    }, [
        initialColumns,
        editingUserIndex,
        loadingSaving,
        validationErrors.current
    ]);

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters: Object.entries(params.filters).map(([id, value]) => ({ id, value })),
            sorting: params.sort ? [{ id: params.sort.replace('-', ''), desc: params.sort.startsWith('-') }] : [],
        },
        manualFiltering: true,
        manualSorting: true,
        meta: {
            roles: roles,
            disabled: newUser || editingUserIndex !== null,
        },
    });

    return (
        <div>
            <div className="rounded-md border uppercase">
                <Table>
                    <TableHeader className="sticky-header">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    {isLoading ? (
                        <DataTableSkeleton columnCount={columns.length} rowCount={10} showHeaders={false} />
                    ) : (
                        <TableBody>
                            {tableData.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    )}
                </Table>
            </div>

            <Footer
                ref={footerRef}
                links={links}
                meta={meta}
                updateParams={updateParams}
                isLoading={isLoading}
                disabled={newUser || editingUserIndex !== null} />
        </div>
    );
}