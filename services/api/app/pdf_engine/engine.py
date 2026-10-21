from dataclasses import dataclass
from datetime import date, datetime
from io import BytesIO
from typing import Any, Literal

from reportlab.lib import colors
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas

from app.pdf_engine.company import ASSETS_DIR, BRAND_TURQUOISE, COMPANY_NAME, OFFICE_DESCRIPTION, ADDRESS, PHONE, RNC, WARNING
from app.pdf_engine.layout import PAGE_W, PAGE_H, CONTENT_LEFT, CONTENT_RIGHT, CONTENT_W, BAR_H, ROW_H, SECTION_GAP, CELL_GAP

FieldType = Literal["text", "checkbox_group", "table", "signature"]

@dataclass(frozen=True)
class FieldSpec:
    label: str
    key: str = ""
    kind: FieldType = "text"
    options: tuple[str, ...] = ()

@dataclass(frozen=True)
class SectionSpec:
    title: str
    rows: tuple[tuple[FieldSpec, ...], ...] = ()

@dataclass(frozen=True)
class FormSpec:
    title: str
    code: str
    sections: tuple[SectionSpec, ...]
    signatures: tuple[str, ...] = ("FIRMA DEL CLIENTE", "FIRMA DE SUPERVISOR DE OFICIALES")
    watermark_all_pages: bool = True

def _value(data: dict[str, Any], key: str) -> str:
    value = data.get(key, "")
    if isinstance(value, bool): return "X" if value else ""
    if isinstance(value, (date, datetime)): return value.strftime("%d / %m / %Y")
    if isinstance(value, str) and len(value) == 10 and value[4] == "-" and value[7] == "-":
        try: return date.fromisoformat(value).strftime("%d / %m / %Y")
        except ValueError: pass
    return str(value or "")

def _draw_header(c: canvas.Canvas, officer: str | None, request_date: date | None) -> None:
    c.drawImage(ImageReader(str(ASSETS_DIR / "header-sosa.jpeg")), 58, PAGE_H - 52 - 97, width=445, height=97, mask="auto", preserveAspectRatio=True)
    c.setFillColor(colors.black); c.setFont("Helvetica-Bold", 7); c.drawCentredString(PAGE_W / 2, PAGE_H - 136, OFFICE_DESCRIPTION)
    c.drawCentredString(PAGE_W / 2, PAGE_H - 147, f"{ADDRESS}, {PHONE}")
    c.drawCentredString(PAGE_W / 2, PAGE_H - 158, RNC)
    y = PAGE_H - 176
    c.setFillColor(colors.HexColor(BRAND_TURQUOISE)); c.rect(CONTENT_LEFT, y - BAR_H, CONTENT_W, BAR_H, fill=1, stroke=0)
    c.setFillColor(colors.white); c.setFont("Times-Roman", 8.5); c.drawString(CONTENT_LEFT + 4, y - 10, f"OFICIAL: {officer or ''}")
    c.setFont("Times-Roman", 8.5); c.drawString(344, y - 10, "FECHA DE SOLICITUD")
    c.setFont("Helvetica", 6.5); c.drawString(445, y - 10, (request_date or date.today()).strftime("%d / %m / %Y"))

def _watermark(c: canvas.Canvas) -> None:
    c.saveState(); c.setFillAlpha(.50)
    c.drawImage(ImageReader(str(ASSETS_DIR / "watermark-sosa.png")), 156, 246, width=300, height=300, mask="auto", preserveAspectRatio=True)
    c.restoreState()

def _section(c: canvas.Canvas, y: float, section: SectionSpec, data: dict[str, Any]) -> float:
    c.setFillColor(colors.HexColor(BRAND_TURQUOISE)); c.rect(CONTENT_LEFT, y - BAR_H, CONTENT_W, BAR_H, fill=1, stroke=0)
    c.setFillColor(colors.white); c.setFont("Helvetica", 7.5); c.drawCentredString(PAGE_W / 2, y - 10, section.title.upper())
    # Separación visual entre la barra turquesa y la primera línea de campos.
    y -= BAR_H + 11
    for row in section.rows:
        widths = [CONTENT_W * (1 / len(row)) for _ in row]
        x = CONTENT_LEFT
        for field, width in zip(row, widths):
            if field.kind == "checkbox_group":
                c.setFillColor(colors.black); c.setFont("Helvetica-Bold", 8); c.drawString(x, y, field.label + ":")
                xx = x + 42
                for option in field.options:
                    c.rect(xx, y - 5, 7, 7, fill=0, stroke=1)
                    if _value(data, field.key) == option: c.setFont("Helvetica-Bold", 7); c.drawString(xx + 1, y - 4, "x")
                    c.setFont("Helvetica-Bold", 8); c.drawString(xx + 10, y, option); xx += 10 + c.stringWidth(option, "Helvetica-Bold", 8) + 8
            else:
                value = _value(data, field.key)
                c.setFillColor(colors.black); c.setFont("Helvetica-Bold", 8); c.drawString(x, y, field.label + ":")
                offset = c.stringWidth(field.label + ":", "Helvetica-Bold", 8) + 4
                c.setFont("Helvetica", 7.5); c.drawString(x + offset, y, value)
            c.setStrokeColor(colors.HexColor("#75CFC3")); c.setLineWidth(.5); c.line(x, y - 3, x + width - CELL_GAP, y - 3)
            x += width
        y -= ROW_H
    return y - SECTION_GAP

def render_form_pdf(spec: FormSpec, data: dict[str, Any], officer: str | None = None, request_date: date | None = None) -> bytes:
    output = BytesIO(); c = canvas.Canvas(output, pagesize=(PAGE_W, PAGE_H))
    y = PAGE_H - 207
    _watermark(c); _draw_header(c, officer, request_date)
    for section in spec.sections:
        needed = BAR_H + 5 + ROW_H * len(section.rows) + SECTION_GAP
        if y - needed < 90:
            c.showPage(); y = PAGE_H - 45
            if spec.watermark_all_pages: _watermark(c)
        y = _section(c, y, section, data)
    if y - 130 < 70:
        c.showPage(); y = PAGE_H - 45
        if spec.watermark_all_pages: _watermark(c)
    y -= 40
    c.setStrokeColor(colors.black); c.setLineWidth(.5); c.setFont("Times-Roman", 8)
    for i, label in enumerate(spec.signatures):
        col = i % 2; row = i // 2; x = CONTENT_LEFT + col * (CONTENT_W / 2); yy = y - row * 70
        c.line(x, yy, x + 150, yy); c.drawCentredString(x + 75, yy - 18, label)
    last = y - ((len(spec.signatures) - 1) // 2) * 70 - 40
    c.setFillColor(colors.HexColor("#D9302C")); c.setFont("Times-Roman", 8); c.drawCentredString(PAGE_W / 2, last, WARNING)
    c.setFillColor(colors.HexColor("#888888")); c.setFont("Helvetica", 5.5); c.drawRightString(CONTENT_RIGHT, 30, f"{spec.code} · 1 / 1")
    c.save(); return output.getvalue()
