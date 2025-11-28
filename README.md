# HealthyTrack Pro

**Aplicación completa de registro de salud, ejercicio y bienestar**

## 🎯 Descripción

HealthyTrack Pro es una aplicación full-stack que te permite registrar y visualizar tu actividad diaria, salud y progreso semanal. Incluye:

- ✅ Registro de caminatas, ejercicios y sesiones de gimnasio
- ✅ Tracking de comidas con fotos
- ✅ Métricas de salud (RHR, HRV, sueño, estrés, energía)
- ✅ Dashboards con gráficos interactivos
- ✅ Reportes semanales automáticos
- ✅ Sistema de recomendaciones personalizadas basado en tus métricas

---

## 🛠️ Stack Tecnológico

### Backend
- **NestJS** - Framework Node.js modular y escalable
- **Prisma** - ORM para PostgreSQL
- **JWT** - Autenticación stateless
- **Bcrypt** - Hashing de passwords
- **Cloudinary** - Almacenamiento de imágenes

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool ultra-rápido
- **Zustand** - State management simple y eficiente
- **Tailwind CSS** - Utility-first CSS
- **Recharts** - Gráficos y visualizaciones
- **React Router** - Navegación

### Base de Datos
- **PostgreSQL** - Base de datos relacional

---

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ y npm
- PostgreSQL 14+
- (Opcional) Cuenta de Cloudinary para fotos de comidas

### 1. Clonar el Repositorio

```bash
cd healthytrack-pro
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### Configurar Variables de Entorno

Copia `.env.example` a `.env` y configura:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/healthytrack?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_EXPIRES_IN="7d"

# Cloudinary (opcional para fotos de comidas)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

PORT=3000
NODE_ENV="development"
```

#### Ejecutar Migraciones de Prisma

```bash
# Generar cliente Prisma
npx prisma generate

# Crear base de datos y tablas
npx prisma migrate dev --name init
```

#### Iniciar Backend

```bash
npm run start:dev
```

El backend estará corriendo en `http://localhost:3000`

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

#### Configurar Variables de Entorno

Crea `.env` en la carpeta frontend:

```env
VITE_API_URL=http://localhost:3000
```

#### Iniciar Frontend

```bash
npm run dev
```

El frontend estará corriendo en `http://localhost:5173`

---

## 📚 Documentación de API

### Base URL
```
http://localhost:3000
```

### Autenticación

Todos los endpoints excepto `/auth/login` y `/auth/register` requieren un token JWT en el header:

```
Authorization: Bearer <your_jwt_token>
```

###Auth

#### POST `/auth/register`
Registrar nuevo usuario

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### POST `/auth/login`
Iniciar sesión

**Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### GET `/auth/profile`
Obtener perfil del usuario autenticado

---

### Walks (Caminatas)

#### POST `/walks`
Registrar caminata

**Body:**
```json
{
  "duration": 30,
  "distance": 2.5,
  "intensity": "medium",
  "date": "2024-01-15T10:00:00Z",
  "notes": "Morning walk"
}
```

#### GET `/walks`
Listar caminatas (con filtros opcionales)

**Query params:**
- `startDate`: ISO string
- `endDate`: ISO string

#### GET `/walks/stats`
Estadísticas de caminatas

---

### Home Exercises (Ejercicios en Casa)

#### POST `/home-exercises`
```json
{
  "type": "cardio",
  "duration": 20,
  "level": "intermediate",
  "date": "2024-01-15T16:00:00Z"
}
```

#### GET `/home-exercises`
#### GET `/home-exercises/stats`

---

### Gym (Gimnasio)

#### POST `/gym/sessions`
Crear sesión de gimnasio

```json
{
  "name": "Push Day",
  "date": "2024-01-15T18:00:00Z",
  "duration": 60
}
```

#### POST `/gym/sessions/:sessionId/exercises`
Añadir ejercicio a sesión

```json
{
  "name": "Bench Press",
  "sets": 4,
  "reps": 10,
  "weight": 80,
  "restTime": 90
}
```

#### GET `/gym/sessions`
#### GET `/gym/sessions/:id`
#### GET `/gym/progress/:exerciseName`

---

### Meals (Comidas)

#### POST `/meals`
```json
{
  "photoUrl": "https://cloudinary.com/...",
  "description": "Grilled chicken with vegetables",
  "calories": 450,
  "type": "lunch"
}
```

#### GET `/meals`
#### GET `/meals/stats`

---

### Health (Salud)

#### POST `/health/sleep`
```json
{
  "hours": 7.5,
  "quality": 8,
  "date": "2024-01-15T06:00:00Z"
}
```

#### POST `/health/stress`
```json
{
  "level": 4,
  "date": "2024-01-15T20:00:00Z"
}
```

#### POST `/health/heart-metrics`
```json
{
  "rhr": 58,
  "hrv": 75,
  "date": "2024-01-15T07:00:00Z"
}
```

#### GET `/health/heart-metrics/analysis`
Análisis automático de métricas cardíacas

#### POST `/health/energy`
```json
{
  "level": 7,
  "date": "2024-01-15T12:00:00Z"
}
```

---

### Reports (Reportes)

#### GET `/reports/daily`
Resumen del día actual o fecha específica

**Query params:**
- `date`: ISO string (opcional)

**Response:**
```json
{
  "id": "uuid",
  "date": "2024-01-15T00:00:00Z",
  "walkMinutes": 60,
  "exerciseMinutes": 20,
  "gymSessions": 1,
  "totalCalories": 2100,
  "sleepHours": 7.5,
  "sleepQuality": 8,
  "stressLevel": 3,
  "energyLevel": 7,
  "rhr": 58,
  "hrv": 75
}
```

#### GET `/reports/weekly`
Reporte semanal con recomendaciones

**Query params:**
- `weekNumber`: número de semana ISO (opcional)
- `year`: año (opcional)

**Response:**
```json
{
  "weekNumber": 3,
  "year": 2024,
  "totalCalories": 14700,
  "totalActiveMinutes": 450,
  "avgSleepHours": 7.2,
  "avgStress": 4.1,
  "avgEnergy": 6.8,
  "avgRhr": 60,
  "avgHrv": 72,
  "totalGymSessions": 3,
  "recommendations": [
    "All metrics look good! Maintain your current routine",
    "Great consistency with gym sessions! Keep up the good work"
  ],
  "fatigueDetected": false,
  "stressDetected": false,
  "lowEnergyDetected": false
}
```

---

## 🎨 Características de la UI

### Diseño Minimalista
- Paleta de colores: violeta suave (#8b5cf6), gris oscuro, blanco
- Tipografía: fuente Inter
- Totalmente responsive (móvil, tablet, desktop)

### Dashboards Interactivos
- Gráficos con Recharts
- Tarjetas de métricas en tiempo real
- Indicadores circulares para energía y estrés

### Pantallas Principales
1. **Landing** - Página de bienvenida
2. **Login/Register** - Autenticación
3. **Dashboard** - Vista principal con resumen del día
4. **Activity Hub** - Centro para registrar actividades
5. **Walks** - Gestión de caminatas
6. **Home Exercises** - Ejercicios en casa
7. **Gym** - Sesiones y progreso de gimnasio
8. **Meals** - Galería de comidas
9. **Health** - Métricas de salud (sueño, estrés, RHR/HRV, energía)
10. **Reports** - Reportes diarios y semanales con gráficos
11. **Calendar** - Vista de calendario mensual

---

## 🧠 Lógica Avanzada

### Interpretación Automática de Métricas

El sistema analiza tus datos y detecta:

- **Fatiga**: Si RHR sube >8 bpm → posible fatiga
- **Estrés Elevado**: Si HRV baja >15% → estrés detectado
- **Baja Energía**: 2 días seguidos con energía ≤4 → recomendar descanso
- **Sin Progreso**: 7 días sin mejoras en gimnasio → notificación

### Recomendaciones Personalizadas

Basadas en tus métricas, el sistema sugiere:
- Más descanso si detecta fatiga
- Ajustar caminatas si RHR elevado
- Técnicas de manejo de estrés si HRV baja
- Revisar rutina si no hay progreso

---

## 🚀 Deploy

### Backend

**Recomendado: Railway**
1. Crear cuenta en [Railway.app](https://railway.app)
2. Conectar repo de GitHub
3. Config de DB PostgreSQL incluida
4. Deploy automático ✅

**Alternativas:**
- Render
- DigitalOcean App Platform
- Heroku

### Frontend

**Recomendado: Vercel**
1. Conectar repo a [Vercel](https://vercel.com)
2. Build automático desde `frontend/`
3. SSL gratis ✅

**Alternativas:**
- Netlify
- Cloudflare Pages

### Base de Datos

**Supabase** (recomendado)
- Free tier: 500MB
- Dashboard incluido
- Backups automáticos

---

## 📊 Estructura del Proyecto

```
healthytrack-pro/
├── backend/
│   ├── src/
│   │   ├── auth/           # Autenticación JWT
│   │   ├── walks/          # Módulo de caminatas
│   │   ├── home-exercises/ # Ejercicios en casa
│   │   ├── gym/            # Gimnasio
│   │   ├── meals/          # Comidas
│   │   ├── health/         # Métricas de salud
│   │   ├── reports/        # Reportes
│   │   ├── prisma/         # Servicio Prisma
│   │   └── common/         # Guards, decorators
│   └── prisma/
│       └── schema.prisma   # Esquema de BD
│
└── frontend/
    ├── src/
    │   ├── components/     # Componentes reutilizables
    │   ├── pages/          # Páginas principales
    │   ├── store/          # Zustand stores
    │   ├── services/       # API calls
    │   ├── hooks/          # Custom hooks
    │   ├── types/          # TypeScript types
    │   └── utils/          # Utilidades
    └── public/
```

---

## 🔮 Roadmap v2.0

### Próximas Features
- 🔗 Sincronización con wearables (Apple Health, Fitbit, Garmin)
- 👥 Features sociales (compartir logros, grupos)
- 🏆 Gamificación (puntos, badges, streaks)
- 🤖 IA para recomendaciones avanzadas
- 📱 App móvil nativa (React Native)
- 📊 Análisis nutricional avanzado (macros)
- 🧘 Meditación y yoga guiados
- 📈 Exportar datos (CSV, PDF)

---

## 📝 Licencia

MIT

---

## 👨‍💻 Autor

**HealthyTrack Pro** - Aplicación completa de salud y bienestar

---

## 🙏 Agradecimientos

Construido con:
- NestJS
- React
- Prisma
- Tailwind CSS
- y mucho ❤️

---

**¿Preguntas o sugerencias?** ¡Abre un issue!

**Star ⭐ este repositorio si te fue útil!**
