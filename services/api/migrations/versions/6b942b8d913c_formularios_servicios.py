"""Formularios de servicios y clasificación de préstamos."""
from alembic import op
import sqlalchemy as sa
revision = "6b942b8d913c"
down_revision = "3a84c1e2b5f7"
branch_labels = None
depends_on = None

def upgrade():
    op.add_column("solicitudes", sa.Column("servicio", sa.String(), nullable=False, server_default="personal"))
    op.add_column("solicitudes", sa.Column("equipo", sa.String(), nullable=True))
    op.add_column("solicitudes", sa.Column("tienda", sa.String(), nullable=True))
    op.create_table("solicitudes_servicio",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("servicio", sa.String(), nullable=False),
        sa.Column("datos", sa.JSON(), nullable=False),
        sa.Column("pdf", sa.LargeBinary(), nullable=False),
        sa.Column("documentos", sa.JSON(), nullable=False),
        sa.Column("email_enviado", sa.Boolean(), nullable=False),
        sa.Column("creado_en", sa.DateTime(timezone=True), nullable=False),
    )

def downgrade():
    op.drop_table("solicitudes_servicio")
    for column in ("tienda", "equipo", "servicio"):
        op.drop_column("solicitudes", column)
