import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './routes/Home';
import { NotFound } from './routes/NotFound';

// Las rutas de juegos están impresas en códigos QR: ver src/paths.ts antes de tocarlas.
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      // El resto de pantallas se descargan al entrar (el inicio carga más rápido desde el QR).
      { path: 'cuento/:id', lazy: async () => ({ Component: (await import('./routes/StoryReader')).StoryReader }) },
      { path: 'actividades/ordenar', lazy: async () => ({ Component: (await import('./routes/activities/OrderGame')).OrderGame }) },
      { path: 'actividades/diferencias', lazy: async () => ({ Component: (await import('./routes/activities/DifferencesGame')).DifferencesGame }) },
      { path: 'actividades/zanahorias', lazy: async () => ({ Component: (await import('./routes/activities/FindGame')).FindGame }) },
      { path: 'chat', lazy: async () => ({ Component: (await import('./routes/Chat')).Chat }) },
      // Rutas antiguas sin enlaces: se redirigen al inicio.
      ...['cuentos', 'actividades', 'lector'].map((path) => ({ path, element: <Navigate to="/" replace /> })),
      { path: '*', element: <NotFound /> },
    ],
  },
]);
