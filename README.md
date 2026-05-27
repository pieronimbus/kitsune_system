# 🦊 Kitsune Finance

**Sistema personal de finanzas — PWA instalable, 100% local, sin backend ni cuentas.**

> Diseñado para funcionar offline, instalarse como app nativa en Android/iOS, y no enviar ningún dato a ningún servidor. Todo queda en tu dispositivo.

---

## ✨ Características

- 📊 **Dashboard mensual** — excedente, proyección, Daily Highlight
- ➕ **Registro rápido** — chips de categoría, sugerencias automáticas, swipe para eliminar
- 📋 **Historial** — búsqueda, filtros, edición inline, selección masiva
- 📈 **Informe** — donut, histograma diario, acumulado vs sueldo, análisis automático
- 📅 **Proyección 12 meses** — tabla completa con bonos, recurrentes, deudas
- 🏡 **Módulo de proyecto** — inversiones y tareas para proyectos de largo plazo
- 🔔 **Notificaciones** — alertas de deudas y presupuesto (requiere permiso del browser)
- ⚙️ **Config total** — categorías, presupuestos, recurrentes, bonos y deudas editables desde la app
- 📤 **Exportar** — CSV, HTML imprimible, backup JSON

---

## 📁 Estructura del repo

```
kitsune-finance/
├── index.html        ← app completa (single file)
├── sw.js             ← service worker (cache offline + notificaciones)
├── manifest.json     ← manifiesto PWA
├── icons/
│   ├── icon-192.svg
│   └── icon-512.svg
└── README.md
```

---

## 🚀 Usar la app

**Online:** abre la URL de GitHub Pages en tu browser.

**Instalar como app (recomendado):**
- **Android Chrome:** abre la URL → menú (⋮) → *"Añadir a pantalla de inicio"*
- **iOS Safari:** abre la URL → compartir (□↑) → *"Agregar a pantalla de inicio"*
- **Desktop Chrome:** ícono de instalación (⊕) en la barra de dirección

---

## 🔒 Privacidad

- **Ningún dato se envía a servidores.** Todo vive en el `localStorage` de tu dispositivo.
- El código fuente es público e inspeccionable — no hay secretos.
- Los datos son **tuyos**: exporta un backup JSON en cualquier momento desde Config → Exportar.

---

## 💾 Importar / exportar datos

### Exportar (hacer backup)
Config → pestaña inferior ⚙️ → **Exportar → Backup JSON**

### Importar (restaurar o migrar)
Config ⚙️ → **Restaurar backup JSON** → selecciona el archivo `.json`

> El backup contiene: gastos, categorías, presupuestos, recurrentes, bonos, deudas y configuración de sueldo. No contiene contraseñas ni datos de terceros.

---

## 🛠️ Desarrollo local

No requiere build ni dependencias. Solo abre el archivo:

```bash
# Opción A — servidor local simple (recomendado para que el SW funcione)
python3 -m http.server 8080
# Luego abre: http://localhost:8080

# Opción B — abrir directo (SW no activo, pero la app funciona igual)
open index.html
```

> El Service Worker requiere HTTPS o `localhost` para activarse. En GitHub Pages funciona automáticamente.

---

## 📋 Notas técnicas

| Característica | Detalle |
|---|---|
| Storage | `localStorage` — sin base de datos externa |
| Offline | Cache-first via Service Worker |
| Notificaciones | API nativa del browser — sin servidor push |
| Dependencias | Cero — HTML + CSS + JS vanilla |
| Tamaño | ~150 KB todo incluido |
| Compatibilidad | Chrome/Edge/Firefox/Safari modernos |

---

## 📄 Licencia

MIT — libre para usar, modificar y redistribuir.

---

*Kitsune Finance — hecho para cerebros que piensan rápido y necesitan sistemas simples.*
