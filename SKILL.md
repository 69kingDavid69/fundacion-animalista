---
name: committer
description: Ayuda a estructurar y redactar mensajes de commit siguiendo el estándar Conventional Commits, sin emojis, con un formato claro, profesional y consistente.
---

# Committer Skill

## Descripción general

Esta skill guía al agente para generar mensajes de commit bien estructurados siguiendo la convención **Conventional Commits**. Los commits serán siempre en inglés, sin emojis, con un tipo semántico, un alcance opcional y una descripción concisa.

---

## Cuándo usar esta skill

El agente **debe** activar esta skill cuando:

- El usuario pide "hacer un commit", "commitear", "registrar los cambios", o similar.
- El usuario dice "ayúdame con el mensaje de commit" o "¿cómo hago el commit?".
- Se detectan cambios staged (`git status`) o el usuario menciona archivos modificados.

El agente **NO debe** usar esta skill cuando:

- El usuario solo quiere hacer `git push`, `git pull` u otras operaciones git no relacionadas con commits.
- El usuario explícitamente ya tiene su mensaje de commit redactado y solo pide ejecutarlo.

---

## Formato del commit

```
<tipo>(<alcance>): <descripción corta en imperativo>

[cuerpo opcional — explica el QUÉ y el POR QUÉ, no el CÓMO]

[footer opcional — referencias a issues, breaking changes]
```

### Tipos válidos

| Tipo       | Cuándo usarlo                                              |
|------------|------------------------------------------------------------|
| `feat`     | Nueva funcionalidad visible para el usuario                |
| `fix`      | Corrección de un bug                                       |
| `docs`     | Cambios solo en documentación                              |
| `style`    | Formato, espaciado, puntuación (sin cambio de lógica)      |
| `refactor` | Reestructuración de código sin cambiar comportamiento      |
| `test`     | Añadir o corregir tests                                    |
| `chore`    | Tareas de mantenimiento, dependencias, configuración       |
| `perf`     | Mejoras de rendimiento                                     |
| `ci`       | Cambios en pipelines de CI/CD                              |
| `revert`   | Revertir un commit anterior                                |

### Reglas obligatorias

- **Sin emojis** en ninguna parte del mensaje.
- La descripción corta debe estar en **inglés**, en **imperativo** ("add", "fix", "update", no "added", "fixes").
- Máximo **72 caracteres** en la primera línea.
- El alcance (`scope`) es opcional pero recomendado: usa el nombre del módulo, archivo o feature afectada.
- Si hay un breaking change, añade `BREAKING CHANGE:` en el footer.

---

## Pasos de ejecución

### Paso 1 — Analizar los cambios

Ejecuta para ver el estado actual:

```bash
git status
git diff --staged
```

- Lee los archivos modificados y el diff para entender **qué cambió**.
- Si no hay nada en staging, informa al usuario y pregunta si quiere hacer `git add` primero.

### Paso 2 — Determinar el tipo y el alcance

Basándote en el diff:

1. Identifica el **tipo** de cambio usando la tabla anterior.
2. Determina el **alcance**: nombre del módulo, componente o archivo principal afectado (en minúsculas, sin espacios).
3. Si los cambios tocan múltiples áreas sin relación, sugiere dividir en varios commits.

### Paso 3 — Redactar el mensaje

Construye el mensaje siguiendo el formato. Ejemplo:

```
feat(auth): add JWT refresh token endpoint

Implements the POST /auth/refresh endpoint to allow clients to obtain
a new access token using a valid refresh token. Refresh tokens are
rotated on each use to reduce replay attack risk.

Closes #42
```

Muestra el mensaje propuesto al usuario antes de ejecutar.

### Paso 4 — Confirmar y ejecutar

Espera confirmación del usuario. Una vez aprobado:

```bash
git commit -m "<primera línea>" -m "<cuerpo si existe>"
```

Si el mensaje tiene cuerpo o footer, usa un archivo temporal para evitar problemas con caracteres especiales:

```bash
git commit -F /tmp/commit_msg.txt
```

---

## Manejo de errores

| Situación                         | Acción a tomar                                               |
|-----------------------------------|--------------------------------------------------------------|
| No hay cambios en staging         | Informar al usuario y preguntar si quiere hacer `git add`    |
| Cambios en demasiados módulos     | Sugerir dividir en commits más pequeños y atómicos           |
| Usuario no sabe qué tipo usar     | Preguntar "¿es una nueva función, un bug fix o mantenimiento?" |
| Conflicto de merge sin resolver   | Detener y pedir al usuario que resuelva los conflictos primero |

---

## Notas y restricciones

- **Nunca** incluyas emojis en el mensaje de commit.
- **Nunca** uses el tiempo pasado ("added", "fixed") — siempre imperativo.
- **No** hagas el commit automáticamente sin confirmación del usuario.
- Si el usuario insiste en un mensaje que viola el formato, aplícalo de todas formas pero indica la desviación del estándar.

---

## Ejemplo de uso

**Input del usuario:**
> "Haz commit de los cambios, agregué validación al formulario de login."

**Output esperado del agente:**

1. Ejecuta `git status` y `git diff --staged`.
2. Detecta cambios en `src/components/LoginForm.jsx` y `src/utils/validators.js`.
3. Propone el mensaje:
   ```
   feat(auth): add input validation to login form

   Validates email format and minimum password length on the client side
   before submitting the form, reducing unnecessary API calls.
   ```
4. Espera confirmación del usuario.
5. Ejecuta `git commit` con el mensaje aprobado.
