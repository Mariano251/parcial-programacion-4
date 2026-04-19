from typing import List, Optional
from sqlmodel import Session, select
from fastapi import HTTPException
from ..models.producto import Producto, ProductoCategoria, ProductoIngrediente
from ..models.categoria import Categoria
from ..models.ingrediente import Ingrediente
from ..schemas.producto import ProductoCreate, ProductoUpdate


def get_all(
    session: Session,
    offset: int = 0,
    limit: int = 20,
    disponible: Optional[bool] = None,
) -> List[Producto]:
    query = select(Producto)
    if disponible is not None:
        query = query.where(Producto.disponible == disponible)
    return session.exec(query.offset(offset).limit(limit)).all()


def get_by_id(session: Session, producto_id: int) -> Producto:
    p = session.get(Producto, producto_id)
    if not p:
        raise HTTPException(status_code=404, detail=f"Producto {producto_id} no encontrado")
    return p


def create(session: Session, data: ProductoCreate) -> Producto:
    producto = Producto(
        nombre=data.nombre,
        descripcion=data.descripcion,
        precio=data.precio,
        disponible=data.disponible,
    )
    session.add(producto)
    session.flush()

    for cat_id in data.categoria_ids:
        cat = session.get(Categoria, cat_id)
        if not cat:
            raise HTTPException(status_code=404, detail=f"Categoría {cat_id} no encontrada")
        session.add(ProductoCategoria(producto_id=producto.id, categoria_id=cat_id))

    for ing_id in data.ingrediente_ids:
        ing = session.get(Ingrediente, ing_id)
        if not ing:
            raise HTTPException(status_code=404, detail=f"Ingrediente {ing_id} no encontrado")
        session.add(ProductoIngrediente(producto_id=producto.id, ingrediente_id=ing_id))

    session.commit()
    session.refresh(producto)
    return producto


def update(session: Session, producto_id: int, data: ProductoUpdate) -> Producto:
    producto = get_by_id(session, producto_id)
    update_data = data.model_dump(exclude_unset=True, exclude={"categoria_ids", "ingrediente_ids"})
    for key, value in update_data.items():
        setattr(producto, key, value)

    if data.categoria_ids is not None:
        for pc in session.exec(
            select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)
        ).all():
            session.delete(pc)
        for cat_id in data.categoria_ids:
            session.add(ProductoCategoria(producto_id=producto_id, categoria_id=cat_id))

    if data.ingrediente_ids is not None:
        for pi in session.exec(
            select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)
        ).all():
            session.delete(pi)
        for ing_id in data.ingrediente_ids:
            session.add(ProductoIngrediente(producto_id=producto_id, ingrediente_id=ing_id))

    session.add(producto)
    session.commit()
    session.refresh(producto)
    return producto


def delete(session: Session, producto_id: int) -> None:
    producto = get_by_id(session, producto_id)

    for pc in session.exec(select(ProductoCategoria).where(ProductoCategoria.producto_id == producto_id)).all():
        session.delete(pc)

    for pi in session.exec(select(ProductoIngrediente).where(ProductoIngrediente.producto_id == producto_id)).all():
        session.delete(pi)

    session.delete(producto)
    session.commit()
