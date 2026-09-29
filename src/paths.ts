// Estas rutas están impresas en códigos QR (muela.pages.dev/actividades/ordenar?story=...): no cambiarlas.
export const paths = {
  home: '/',
  story: (id: string) => `/cuento/${id}`,
  order: (id: string) => `/actividades/ordenar?story=${id}`,
  differences: (id: string) => `/actividades/diferencias?story=${id}`,
  find: (id: string) => `/actividades/zanahorias?story=${id}`,
  chat: '/chat',
};
