from typing import Optional
from sqlmodel import SQLModel
from pydantic import field_validator


class CategoriaBase(SQLModel):
    nombre: str
    descripcion: Optional[str] = None

    @field_validator("nombre")
    @classmethod
    def nombre_no_vacio(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("El nombre no puede estar vacío")
        if len(v) > 50:
            raise ValueError("El nombre no puede superar 50 caracteres")
        return v.strip()


class CategoriaCreate(CategoriaBase):
    pass


class CategoriaUpdate(SQLModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None


class CategoriaRead(CategoriaBase):
    id: int
