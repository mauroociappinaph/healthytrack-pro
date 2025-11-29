# Workflow de Git Profesional

Este documento define el flujo de trabajo estándar para el desarrollo en este proyecto, asegurando un historial limpio, trazabilidad y colaboración efectiva.

## 1. Estándar de Commits Semánticos

Utilizamos **Conventional Commits** para mantener un historial legible y automatizable.

### Formato
`tipo(alcance): descripción breve`

### Tipos Comunes
- **feat**: Una nueva funcionalidad (e.g., `feat(auth): add login endpoint`)
- **fix**: Corrección de un bug (e.g., `fix(nav): resolve mobile menu crash`)
- **docs**: Cambios solo en documentación
- **style**: Cambios de formato (espacios, comas) que no afectan el código
- **refactor**: Cambio de código que no arregla bugs ni añade features
- **perf**: Cambio que mejora el rendimiento
- **test**: Añadir o corregir tests
- **chore**: Tareas de mantenimiento, build, herramientas (e.g., `chore(deps): update react`)

### Reglas
- Usar imperativo en la descripción ("add" no "added").
- No terminar la descripción con punto.
- Mantener la primera línea bajo 72 caracteres.

---

## 2. Flujo de Trabajo (Workflow)

### Paso 1: Iniciar una Nueva Tarea
**Nunca** trabajes directamente en `develop` o `main`. Crea siempre una rama nueva.

1. Asegúrate de estar en `develop` y actualizado:
   ```bash
   git checkout develop
   git pull origin develop
   ```
2. Crea tu rama de feature (usa nombres descriptivos en minúsculas y guiones):
   ```bash
   git checkout -b feature/nombre-de-la-tarea
   # Ejemplos: feature/login-page, fix/header-alignment
   ```

> **Tip:** Puedes usar el workflow automático: `Ejecuta el workflow start-feature`

### Paso 2: Desarrollo y Commits
Realiza cambios y haz commits frecuentes y atómicos.

```bash
git add .
git commit -m "feat(user): implement avatar upload component"
```

### Paso 3: Finalizar y Fusionar
Una vez terminada la tarea:

1. **Sincroniza con develop** (para resolver conflictos localmente antes de subir):
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/nombre-de-la-tarea
   git merge develop
   ```
2. **Sube tu rama**:
   ```bash
   git push origin feature/nombre-de-la-tarea
   ```
3. **Fusiona en develop** (Si tienes permisos, o abre un Pull Request):
   ```bash
   git checkout develop
   git merge feature/nombre-de-la-tarea
   git push origin develop
   ```

### Paso 4: Limpieza
Una vez que el código está seguro en `develop`, elimina tu rama local para mantener el entorno limpio.

```bash
git branch -d feature/nombre-de-la-tarea
```

> **Tip:** Puedes usar el workflow automático: `Ejecuta el workflow finish-feature`

---

## 3. Resumen de Comandos Rápidos

| Acción | Comando |
|--------|---------|
| Actualizar todo | `git checkout develop && git pull` |
| Nueva rama | `git checkout -b feature/mi-feature` |
| Guardar cambios | `git commit -m "tipo: descripción"` |
| Subir rama | `git push -u origin feature/mi-feature` |
