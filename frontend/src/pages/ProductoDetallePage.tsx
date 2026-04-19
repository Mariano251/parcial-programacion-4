import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductoById } from '../api/productos';

export default function ProductoDetallePage() {
  const { id } = useParams<{ id: string }>();

  const { data: producto, isLoading, isError } = useQuery({
    queryKey: ['producto', Number(id)],
    queryFn: () => getProductoById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <div className="p-8 text-slate-500">Cargando producto...</div>;
  if (isError || !producto) return <div className="p-8 text-red-500">Producto no encontrado.</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link to="/productos" className="text-orange-500 hover:underline text-sm mb-4 inline-block">
        &larr; Volver a productos
      </Link>
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-slate-800">{producto.nombre}</h1>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              producto.disponible
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-600'
            }`}
          >
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>
        <p className="text-slate-500 mb-4">{producto.descripcion ?? 'Sin descripción.'}</p>
        <p className="text-2xl font-bold text-orange-500 mb-6">
          ${Number(producto.precio).toFixed(2)}
        </p>

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Categorías
          </h3>
          <div className="flex gap-2 flex-wrap">
            {producto.categorias.length === 0 ? (
              <span className="text-slate-400 text-sm">Sin categorías</span>
            ) : (
              producto.categorias.map(pc => (
                <span
                  key={pc.categoria?.id ?? Math.random()}
                  className="bg-orange-100 text-orange-700 text-xs px-3 py-1 rounded-full font-medium"
                >
                  {pc.categoria?.nombre ?? 'Categoría'}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
            Ingredientes
          </h3>
          {producto.ingredientes.length === 0 ? (
            <span className="text-slate-400 text-sm">Sin ingredientes</span>
          ) : (
            <ul className="divide-y divide-slate-100">
              {producto.ingredientes.map(pi => (
                <li key={pi.ingrediente.id} className="py-2 flex justify-between text-sm">
                  <span className="text-slate-700 font-medium">
                    {pi.ingrediente.nombre}
                    {pi.ingrediente.es_alergeno && (
                      <span className="ml-2 text-xs text-red-500 font-semibold">⚠ Alérgeno</span>
                    )}
                  </span>
                  {pi.cantidad && <span className="text-slate-400">{pi.cantidad}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
