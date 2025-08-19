import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route } from '../../vendor/tightenco/ziggy/src/js';
import { ActiveBranchProvider } from './contexts/active-branch';

const appName = import.meta.env.VITE_APP_NAME || 'Temys';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            (global as any).route = (name: string, params?: object, absolute?: boolean) =>
                route(name, params as Record<string, any> | undefined, absolute, {
                    ...((page.props.ziggy as Record<string, any>) || {}),
                    url: (page.props.ziggy as Record<string, any>).url || '',
                    port: (page.props.ziggy as Record<string, any>).port || null,
                    defaults: (page.props.ziggy as Record<string, any>).defaults || {},
                    routes: (page.props.ziggy as Record<string, any>).routes || {},
                    location: new URL((page.props.ziggy as Record<string, any>).location || ''),
                });

            return (
                <ActiveBranchProvider>
                    <App {...props} />
                </ActiveBranchProvider>
            );
        },
    }),
);
