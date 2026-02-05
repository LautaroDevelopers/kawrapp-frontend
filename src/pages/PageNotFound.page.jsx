export const PageNotFound = () => {
  return (
    <div className="bg-gray-200 text-black min-h-screen flex items-center justify-center flex-col space-y-4">
      <h1 className="text-2xl font-bold">404 - Página no encontrada</h1>
      <p>Lo sentimos, la página que buscas no existe.</p>
      <a href="/" className="text-white rounded hover:underline p-3 bg-blue-600">Volver al inicio</a>
    </div>
  );
};