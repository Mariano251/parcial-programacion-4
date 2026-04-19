import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/categorias', label: 'Categorías' },
  { to: '/ingredientes', label: 'Ingredientes' },
  { to: '/productos', label: 'Productos' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  return (
    <nav className="bg-slate-900 text-white px-8 py-4 flex items-center gap-8 shadow-lg">
      <span className="font-bold text-xl text-orange-400 tracking-tight">🍽 Food Store</span>
      <div className="flex gap-4">
        {links.map(l => (
          <Link
            key={l.to}
            to={l.to}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname.startsWith(l.to)
                ? 'bg-orange-500 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
