from typing import Optional, List
from decimal import Decimal
from sqlmodel import SQLModel
from pydantic import field_validator
from .categoria import CategoriaRead
from .ingrediente import IngredienteRead


class ProductoBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None
    precio: Decimal
    disponible: bool = True

    @field_validator("precio")
    @classmethod
    def precio_positivo(cls, v: Decimal) -> Decimal:
        if v < 0:
            raise ValueError("El precio no puede ser negativo")
        return v

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        return v.strip()


class ProductoCreate(ProductoBase):
    categoria_ids: List[int] = []
    ingrediente_ids: List[int] = []


class ProductoUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None
    precio: Optional[Decimal] = None
    disponible: Optional[bool] = None
    categoria_ids: Optional[List[int]] = None
    ingrediente_ids: Optional[List[int]] = None


class ProductoCategoriaRead(SQLModel):
    categoria: Optional[CategoriaRead] = None


class IngredienteConCantidad(SQLModel):
    ingrediente: IngredienteRead
    cantidad: Optional[str] = None


class ProductoRead(ProductoBase):
    id: int
    categorias: List[ProductoCategoriaRead] = []
    ingredientes: List[IngredienteConCantidad] = []
