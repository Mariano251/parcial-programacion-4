# 🍽️ Food Store — Backend

API REST para la gestión de productos, categorías e ingredientes de un negocio gastronómico.

![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=flat&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-4169E1?style=flat&logo=postgresql&logoColor=white)
![SQLModel](https://img.shields.io/badge/SQLModel-0.0.19+-FF6B6B?style=flat)

---

## Tecnologías

| Tecnología | Versión |
|------------|---------|
| Python | 3.11+ |
| FastAPI | 0.111+ |
| SQLModel | 0.0.19+ |
| Pydantic | 2.7+ |
| PostgreSQL | 17 |
| psycopg2-binary | 2.9.9+ |
| uvicorn | 0.29+ |
| python-dotenv | 1.0+ |

---

## Requisitos previos

Antes de comenzar, asegurate de tener instalado:

- **Python 3.11+** — [python.org/downloads](https://www.python.org/downloads/)
- **PostgreSQL 17** — [postgresql.org/download](https://www.postgresql.org/download/)
- **Git** — [git-scm.com](https://git-scm.com/)

---

## Instalación paso a paso

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd food-store/backend
```

### 2. Crear el entorno virtual

```bash
python -m venv .venv
```

### 3. Activar el entorno virtual

**Windows:**
```bash
.venv\Scripts\activate
```

**Mac / Linux:**
```bash
source .venv/bin/activate
```

### 4. Instalar las dependencias

```bash
pip install -r requirements.txt
```

### 5. Crear el archivo de variables de entorno

```bash
cp env.example .env
```

### 6. Configurar la variable DATABASE_URL

Abrí el archivo `.env` y reemplazá `TU_PASSWORD` con la contraseña de tu usuario de PostgreSQL:

```env
DATABASE_URL=postgresql://postgres:TU_PASSWORD@localhost:5432/food_store
```

### 7. Crear la base de datos en PostgreSQL

Conectate a `psql` y ejecutá:

```sql
CREATE DATABASE food_store;
```

O desde la terminal:

```bash
psql -U postgres -c "CREATE DATABASE food_store;"
```

### 8. Levantar el servidor

```bash
uvicorn app.main:app --reload
```

El servidor estará disponible en: **http://localhost:8000**
Documentación interactiva (Swagger): **http://localhost:8000/docs**

---

## Endpoints disponibles

### Categorías

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/categorias/` | Lista todas las categorías |
| `GET` | `/categorias/{id}` | Obtiene una categoría por ID |
| `POST` | `/categorias/` | Crea una nueva categoría |
| `PATCH` | `/categorias/{id}` | Actualiza parcialmente una categoría |
| `DELETE` | `/categorias/{id}` | Elimina una categoría |

### Ingredientes

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/ingredientes/` | Lista todos los ingredientes |
| `GET` | `/ingredientes/{id}` | Obtiene un ingrediente por ID |
| `POST` | `/ingredientes/` | Crea un nuevo ingrediente |
| `PATCH` | `/ingredientes/{id}` | Actualiza parcialmente un ingrediente |
| `DELETE` | `/ingredientes/{id}` | Elimina un ingrediente |

### Productos

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/productos/` | Lista todos los productos (soporta filtro `?disponible=true`) |
| `GET` | `/productos/{id}` | Obtiene un producto por ID con categorías e ingredientes |
| `POST` | `/productos/` | Crea un nuevo producto con relaciones N:N |
| `PATCH` | `/productos/{id}` | Actualiza parcialmente un producto |
| `DELETE` | `/productos/{id}` | Elimina un producto y sus relaciones |

---

## Estructura del proyecto

```
backend/
├── app/
│   ├── main.py               # Entrada de la aplicación, CORS, routers
│   ├── database.py           # Configuración del engine y sesión
│   ├── models/
│   │   ├── categoria.py      # Modelo SQLModel de Categoria
│   │   ├── producto.py       # Modelos Producto, ProductoCategoria, ProductoIngrediente
│   │   └── ingrediente.py    # Modelo SQLModel de Ingrediente
│   ├── schemas/
│   │   ├── categoria.py      # Schemas de entrada/salida para Categoria
│   │   ├── producto.py       # Schemas de entrada/salida para Producto
│   │   └── ingrediente.py    # Schemas de entrada/salida para Ingrediente
│   ├── routers/
│   │   ├── categorias.py     # Endpoints REST de categorías
│   │   ├── productos.py      # Endpoints REST de productos
│   │   └── ingredientes.py   # Endpoints REST de ingredientes
│   ├── services/
│   │   ├── categoria_service.py   # Lógica de negocio de categorías
│   │   ├── producto_service.py    # Lógica de negocio de productos
│   │   └── ingrediente_service.py # Lógica de negocio de ingredientes
│   └── uow/
│       └── unit_of_work.py   # Patrón Unit of Work
├── requirements.txt          # Dependencias del proyecto
├── env.example               # Plantilla de variables de entorno
└── README.md
```

---

## Autores

Arena Lucio
Cunto Tiago
Lopez Tubaro Mariano
Rojo Emiliano

