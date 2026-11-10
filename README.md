# Una cita contigo ❤️

Experiencia web interactiva y romántica para invitar a alguien especial a una cita.

## Características

- Experiencia multi-pantalla con animaciones suaves (Framer Motion)
- Corazón interactivo que se llena con toques
- Calendario con zona horaria de Colombia (America/Bogota)
- Selección múltiple de actividades por categorías
- Preferencias de tipo de cita y notas personales
- Guardado temporal en localStorage
- Envío real de correo con Resend
- Diseño mobile-first, romántico y minimalista

## Requisitos

- Node.js 18+
- Cuenta en [Resend](https://resend.com) (gratis)

## Instalación

```bash
cd una-cita-contigo
npm install
```

## Configuración de variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=Una cita contigo <onboarding@resend.dev>
```

### Cómo obtener la API Key de Resend

1. Ve a https://resend.com y crea una cuenta.
2. En el dashboard, ve a **API Keys** → **Create API Key**.
3. Copia la clave y pégala en `.env.local`.
4. Por defecto puedes usar el dominio de prueba `onboarding@resend.dev` (solo envía a tu propio email verificado).
5. Para producción, verifica tu propio dominio en Resend y cambia `RESEND_FROM_EMAIL`.

## Desarrollo

```bash
npm run dev
```

Abre http://localhost:3000

## Despliegue en Vercel (recomendado)

1. Sube el proyecto a GitHub.
2. Importa el repositorio en [Vercel](https://vercel.com).
3. En **Settings → Environment Variables** agrega:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` (opcional)
4. Deploy.

La URL pública que te dé Vercel es la que puedes convertir en código QR.

## Música ambiental (opcional)

Coloca un archivo de audio instrumental romántico en:

```
public/romantic-ambient.mp3
```

El botón de música en la esquina inferior derecha lo reproducirá cuando la usuaria lo active.

## Estructura del proyecto

```
src/
├── app/
│   ├── api/send-date/route.ts   # Endpoint de envío de correo
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 # Toda la experiencia
├── components/
│   ├── InteractiveHeart.tsx
│   └── DateCalendar.tsx
└── lib/
    ├── activities.ts            # Lista de actividades
    └── utils.ts
```

## Notas importantes

- Las claves de API **nunca** se exponen al navegador.
- El correo solo se envía después de la confirmación explícita.
- Las selecciones se guardan temporalmente en el navegador.
- No se solicita información personal innecesaria.

Hecho con cariño.
