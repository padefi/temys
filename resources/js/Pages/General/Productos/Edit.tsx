import Create from './Create';
import { usePage } from '@inertiajs/react';

export default function Edit() {
  const { producto } = usePage().props as any;
  return <Create producto={producto} />;
}
