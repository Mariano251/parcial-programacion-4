import { IngredienteCreate } from '../../types';

interface IngredienteFormProps {
  form: IngredienteCreate;
  onChange: (form: IngredienteCreate) => void;
}

export default function IngredienteForm({ form, onChange }: IngredienteFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.nombre}
          onChange={e => onChange({ ...form, nombre: e.target.value })}
          placeholder="Ej: Harina"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.descripcion ?? ''}
          onChange={e => onChange({ ...form, descripcion: e.target.value })}
          rows={3}
          placeholder="Descripción opcional..."
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
        <input
          type="checkbox"
          checked={form.es_alergeno}
          onChange={e => onChange({ ...form, es_alergeno: e.target.checked })}
          className="w-4 h-4 accent-orange-500"
        />
        Es alérgeno
      </label>
    </div>
  );
}
