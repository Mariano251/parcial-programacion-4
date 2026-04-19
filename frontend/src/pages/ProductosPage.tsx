import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from '../api/productos';
import { getCategorias } from '../api/categorias';
import { getIngredientes } from '../api/ingredientes';
import { Producto, ProductoCreate } from '../types';
import Modal from '../components/ui/Modal';

const defaultForm: ProductoCreate = {
  nombre: '',
  descripcion: '',
  precio: 0,
  disponible: true,
  categoria_ids: [],
  ingrediente_ids: [],
};

export default function ProductosPage() {
  const qc = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [form, setForm] = useState<ProductoCreate>(defaultForm);
  const [error, setError] = useState('');

  const { data: productos = [], isLoading, isError } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  });

  const { data: categorias = [] } = useQuery({
    queryKey: ['categorias'],
    queryFn: getCategorias,
  });

  const { data: ingredientes = [] } = useQuery({
    queryKey: ['ingredientes'],
    queryFn: getIngredientes,
  });

  const createMutation = useMutation({
    mutationFn: createProducto,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
      closeModal();
    },
    onError: (e: Error) => setError(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ProductoCreate> }) =>
      updateProducto(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['productos'] });
      closeModal();
    },
    onError: (e: Error) => setError(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProducto,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['productos'] }),
  });

  const openCreate = () => {
    setEditing(null);
    setForm(defaultForm);
    setError('');
    setIsOpen(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p);
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion ?? '',
      precio: Number(p.precio),
      disponible: p.disponible,
      categoria_ids: p.categorias.map(pc => pc.categoria?.id).filter((id): id is number => id !== undefined),
      ingrediente_ids: p.ingredientes.map(pi => pi.ingrediente.id),
    });
    setError('');
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setEditing(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (form.precio < 0) {
      setError('El precio no puede ser negativo');
      return;
    }
    if (editing) {
      updateMutation.mutate({ id: editing.id, data: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const toggleId = (list: number[], id: number): number[] =>
    list.includes(id) ? list.filter(x => x !== id) : [...list, id];

  if (isLoading) return <div className="p-8 text-slate-500">Cargando productos...</div>;
  if (isError) return <div className="p-8 text-red-500">Error al cargar los productos.</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Productos</h1>
        <button
          onClick={openCreate}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Nuevo Producto
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Nombre</th>
              <th className="px-6 py-3 text-left">Precio</th>
              <th className="px-6 py-3 text-left">Disponible</th>
              <th className="px-6 py-3 text-left">Categorías</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {productos.map(p => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 text-slate-400">{p.id}</td>
                <td className="px-6 py-4 font-medium text-slate-800">{p.nombre}</td>
                <td className="px-6 py-4 text-slate-700 font-semibold">
                  ${Number(p.precio).toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  {p.disponible ? (
                    <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                      Sí
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full">
                      No
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1 flex-wrap">
                    {p.categorias.length === 0 ? (
                      <span className="text-slate-400 text-xs">—</span>
                    ) : (
                      p.categorias.map(pc => (
                        <span
                          key={pc.categoria?.id ?? Math.random()}
                          className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium"
                        >
                          {pc.categoria?.nombre ?? '—'}
                        </span>
                      ))
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteMutation.mutate(p.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Eliminar
                    </button>
                    <Link
                      to={`/productos/${p.id}`}
                      className="text-orange-500 hover:underline text-sm"
                    >
                      Ver
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {productos.length === 0 && (
          <p className="px-6 py-8 text-center text-slate-400">No hay productos aún.</p>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={editing ? 'Editar Producto' : 'Nuevo Producto'}
      >
        <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-1">
          {error && (
            <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
            <input
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.nombre}
              onChange={e => setForm(f => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej: Pizza Margherita"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.descripcion ?? ''}
              onChange={e => setForm(f => ({ ...f, descripcion: e.target.value }))}
              rows={2}
              placeholder="Descripción opcional..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Precio *</label>
            <input
              type="number"
              min={0}
              step="0.01"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={form.precio}
              onChange={e => setForm(f => ({ ...f, precio: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={form.disponible}
              onChange={e => setForm(f => ({ ...f, disponible: e.target.checked }))}
              className="w-4 h-4 accent-orange-500"
            />
            Disponible
          </label>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categorías</label>
            <div className="max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2 flex flex-col gap-1">
              {categorias.length === 0 && (
                <span className="text-slate-400 text-xs">Sin categorías disponibles</span>
              )}
              {categorias.map(cat => (
                <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.categoria_ids.includes(cat.id)}
                    onChange={() =>
                      setForm(f => ({ ...f, categoria_ids: toggleId(f.categoria_ids, cat.id) }))
                    }
                    className="w-4 h-4 accent-orange-500"
                  />
                  {cat.nombre}
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Ingredientes</label>
            <div className="max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2 flex flex-col gap-1">
              {ingredientes.length === 0 && (
                <span className="text-slate-400 text-xs">Sin ingredientes disponibles</span>
              )}
              {ingredientes.map(ing => (
                <label key={ing.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.ingrediente_ids.includes(ing.id)}
                    onChange={() =>
                      setForm(f => ({
                        ...f,
                        ingrediente_ids: toggleId(f.ingrediente_ids, ing.id),
                      }))
                    }
                    className="w-4 h-4 accent-orange-500"
                  />
                  {ing.nombre}
                  {ing.es_alergeno && (
                    <span className="text-xs text-red-500">⚠</span>
                  )}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 text-sm rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-medium disabled:opacity-50"
            >
              {editing ? 'Guardar cambios' : 'Crear'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
