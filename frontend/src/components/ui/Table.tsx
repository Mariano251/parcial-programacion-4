import { ReactNode } from 'react';

interface Column {
  label: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  children: ReactNode;
  empty?: string;
  rowCount: number;
}

export default function Table({ columns, children, empty = 'No hay datos.', rowCount }: TableProps) {
  return (
    <div className="bg-white rounded-2xl shadow overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600 uppercase text-xs">
          <tr>
            {columns.map(col => (
              <th key={col.label} className={`px-6 py-3 text-left ${col.className ?? ''}`}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">{children}</tbody>
      </table>
      {rowCount === 0 && (
        <p className="px-6 py-8 text-center text-slate-400">{empty}</p>
      )}
    </div>
  );
}
