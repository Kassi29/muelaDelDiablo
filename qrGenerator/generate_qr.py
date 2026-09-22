import argparse
import os
import re
from datetime import datetime
import qrcode
from qrcode.constants import ERROR_CORRECT_H

def sanitize_filename(name: str) -> str:
    """Convierte una cadena/URL en un nombre de archivo seguro."""
    clean = re.sub(r'^https?:\/\/', '', name)
    clean = re.sub(r'[\/\\:*?"<>|&=?#%]', '_', clean)
    clean = clean.strip('._')
    return clean[:50] if clean else "qr_code"

def generate_qr(url: str, output_name: str = None) -> str:
    # Asegurar que la carpeta qrs/ exista
    base_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(base_dir, "qrs")
    os.makedirs(output_dir, exist_ok=True)

    # Determinar nombre del archivo
    if output_name:
        if not output_name.lower().endswith(".png"):
            output_name += ".png"
        filename = output_name
    else:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        slug = sanitize_filename(url)
        filename = f"{slug}_{timestamp}.png"

    output_path = os.path.join(output_dir, filename)

    # Configurar QR con alta corrección de errores (estático y duradero)
    qr = qrcode.QRCode(
        version=None,
        error_correction=ERROR_CORRECT_H,  # 30% de tolerancia a daños/suciedad
        box_size=10,                      # Tamaño de cada módulo
        border=4                          # Margen estándar recomendado
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(fill_color="black", back_color="white")
    img.save(output_path)

    return output_path

def main():
    parser = argparse.ArgumentParser(
        description="Generador de Códigos QR Estáticos y Permanentes"
    )
    parser.add_argument(
        "url",
        nargs="?",
        help="El link o texto que codificará el código QR"
    )
    parser.add_argument(
        "-o", "--output",
        help="Nombre opcional para el archivo generado (ej. mi_qr.png)",
        default=None
    )

    args = parser.parse_args()

    # Si no se pasó como argumento por terminal, solicitar interactivamente
    url = args.url
    if not url:
        url = input("Ingresa el enlace o texto para el QR: ").strip()

    if not url:
        print("❌ Error: No ingresaste ningún enlace o texto.")
        return

    print(f"\n⏳ Generando QR para: {url}...")
    saved_file = generate_qr(url, args.output)
    print(f"✅ ¡QR generado exitosamente!")
    print(f"📁 Guardado en: {saved_file}\n")

if __name__ == "__main__":
    main()
