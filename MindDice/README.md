## Convención de Commits (Guía del Proyecto)
Para mantener un repositorio organizado y profesional, utilizamos el estándar de **Conventional Commits**.
---

### Tipos de Commits

| Tipo       | Uso |
|------------|-----|
| `feat`     | Nueva funcionalidad |
| `fix`      | Corrección de errores |
| `docs`     | Documentación (README, comentarios, etc.) |
| `chore`    | Configuración o tareas menores |
| `refactor` | Mejora de código sin cambiar funcionalidad |
| `style`    | Cambios visuales o de formato |
| `perf`     | Mejora de rendimiento |
| `test`     | Pruebas |

---

### Ejemplos

```bash
feat: implementar sistema de dados
feat: agregar lógica de puntuación
fix: corregir error en selección de dados
docs: actualizar README del proyecto
chore: configuración inicial de React Native
refactor: optimizar manejo de turnos
style: mejorar diseño del scoreboard
```
## Intalacion de dependencias

### Build, ejecutar y compilar

```bash
cd MindDice
npm install
npm audit fix (SI ES NECESARIO)
```

Deberías ver:

```
BUILD SUCCESSFUL
info Starting the app on "emulator-XXXX"...
```

## Compilacion Aplicativo MindDice

### Build, ejecutar y compilar

```bash
cd MindDice
cd android
./gradlew generateCodegenArtifactsFromSchema
./gradlew clean (SI ES NECESARIO)
./gradlew assembleRelease (SI ES NECESARIO)
cd ..
npx react-native run-android
```

Deberías ver:

```
BUILD SUCCESSFUL
info Starting the app on "emulator-XXXX"...
```
