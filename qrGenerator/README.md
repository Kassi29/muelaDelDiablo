# 📌 Generador de Códigos QR Estáticos y Permanentes

Genera códigos QR **100% estáticos y permanentes** (no usan servidores intermediarios, nunca caducan y codifican el enlace directamente). Cuentan con corrección de error alta (`ERROR_CORRECT_H`), lo que garantiza que se lean incluso si el código se arruga, ensucia o daña.

---

## ⚙️ 1. Requisito previo (Python)

Si aún no tienes Python o la librería instalada en tu terminal:

1. Instala la librería con:
   ```bash
   pip install -r requirements.txt
   ```
   _(o `pip install "qrcode[pil]"`)_

---

## 🚀 2. Formas de usarlo

```cmd
python generate_qr.py "https://muela.pages.dev/actividades/ordenar?story=la-muela" -o "actividades-muela.png"
```

### 🔹 Forma 1: Doble clic (o desde terminal de Windows)

Puedes hacer doble clic en `generar.bat` o correrlo así:

```cmd
generar.bat "https://mi-enlace.com"
```

### 🔹 Forma 2: Comando directo con Python

```bash
python generate_qr.py "https://mi-enlace.com"
```

### 🔹 Forma 3: Con nombre personalizado

```bash
python generate_qr.py "https://mi-enlace.com" -o "menu_restaurante.png"
```

### 🔹 Forma 4: Modo interactivo (solo pegar)

```bash
python generate_qr.py
```

_Te pedirá que escribas o pegues el enlace directamente en la consola._

---

## 📁 ¿Dónde quedan guardados?

Todos los códigos generados se almacenan automáticamente en la carpeta:

```
qrGenerator/qrs/
```
