"""Guardar imágenes de cédula de forma privada con la solicitud.

Revision ID: 3a84c1e2b5f7
Revises: f7d33613d8c1
Create Date: 2026-09-27
"""
from alembic import op
import sqlalchemy as sa


revision = "3a84c1e2b5f7"
down_revision = "f7d33613d8c1"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "adjuntos_solicitud",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("solicitud_id", sa.Integer(), nullable=False),
        sa.Column("tipo", sa.String(), nullable=False),
        sa.Column("nombre_archivo", sa.String(), nullable=False),
        sa.Column("content_type", sa.String(), nullable=False),
        sa.Column("contenido", sa.LargeBinary(), nullable=False),
        sa.Column("creado_en", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["solicitud_id"], ["solicitudes.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_adjuntos_solicitud_solicitud_id", "adjuntos_solicitud", ["solicitud_id"])


def downgrade() -> None:
    op.drop_index("ix_adjuntos_solicitud_solicitud_id", table_name="adjuntos_solicitud")
    op.drop_table("adjuntos_solicitud")
