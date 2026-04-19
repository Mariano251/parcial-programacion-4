import { Categoria, Ingrediente, ProductoCreate } from '../../types';

interface ProductoFormProps {
  form: ProductoCreate;
  onChange: (form: ProductoCreate) => void;
  categorias: Categoria[];
  ingredientes: Ingrediente[];
}

export default function ProductoForm({ form, onChange, categorias, ingredientes }: ProductoFormProps) {
  const toggleId = (list: number[], id: number): number[] =>
    list.includes(id) ? list.filter(x => x !== id) : [...list, id];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.nombre}
          onChange={e => onChange({ ...form, nombre: e.target.value })}
          placeholder="Ej: Pizza Margherita"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.descripcion ?? ''}
          onChange={e => onChange({ ...form, descripcion: e.target.value })}
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
          onChange={e => onChange({ ...form, precio: parseFloat(e.target.value) || 0 })}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={e => onChange({ ...form, disponible: e.target.checked })}
          className="w-4 h-4 accent-orange-500"
        />
        Disponible
      </label>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Categorías</label>
        <div className="max-h-32 overflow-y-auto border border-slate-300 rounded-lg p-2 flex flex-col gap-1">
          {categorias.length === 0 && <span className="text-slate-400 text-xs">Sin categorías disponibles</span>}
          {categorias.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.categoria_ids.includes(cat.id)}
                onChange={() => onChange({ ...form, categoria_ids: toggleId(form.categoria_ids, cat.id) })}
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
          {ingredientes.length === 0 && <span className="text-slate-400 text-xs">Sin ingredientes disponibles</span>}
          {ingredientes.map(ing => (
            <label key={ing.id} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.ingrediente_ids.includes(ing.id)}
                onChange={() => onChange({ ...form, ingrediente_ids: toggleId(form.ingrediente_ids, ing.id) })}
                className="w-4 h-4 accent-orange-500"
              />
              {ing.nombre}
              {ing.es_alergeno && <span className="text-xs text-red-500">⚠</span>}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
