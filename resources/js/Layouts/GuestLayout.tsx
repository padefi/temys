import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, useEffect } from 'react';
import { Toaster } from '@/Components/ui/sonner';
import { toast } from 'sonner';

export default function Guest({ children }: PropsWithChildren) {
    const { errors } = usePage().props;

    useEffect(() => {
        if (errors && errors.message) {
            toast.error(errors.message);
        }
    }, [errors?.message]);

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
                <Toaster position="top-right" expand={true} richColors />
            </div>
        </div>
    );
}
