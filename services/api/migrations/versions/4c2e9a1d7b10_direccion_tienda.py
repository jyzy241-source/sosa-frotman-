"""Agregar dirección de tienda para financiamiento de celulares."""
from alembic import op
import sqlalchemy as sa

revision = "4c2e9a1d7b10"
down_revision = ("3a84c1e2b5f7", "6b942b8d913c")
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column("solicitudes", sa.Column("direccion_tienda", sa.String(), nullable=True))

def downgrade() -> None:
    op.drop_column("solicitudes", "direccion_tienda")
