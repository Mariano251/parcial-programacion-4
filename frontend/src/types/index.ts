export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface CategoriaCreate {
  nombre: string;
  descripcion?: string;
}

export interface Ingrediente {
  id: number;
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
}

export interface IngredienteCreate {
  nombre: string;
  descripcion?: string;
  es_alergeno: boolean;
}

export interface IngredienteConCantidad {
  ingrediente: Ingrediente;
  cantidad?: string;
}

export interface ProductoCategoria {
  categoria?: Categoria;
}

export interface Producto {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categorias: ProductoCategoria[];
  ingredientes: IngredienteConCantidad[];
}

export interface ProductoCreate {
  nombre: string;
  descripcion?: string;
  precio: number;
  disponible: boolean;
  categoria_ids: number[];
  ingrediente_ids: number[];
}
