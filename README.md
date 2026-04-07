# Proyecto Final – Desarrollo Móvil II  
![Logo](https://campus.utn.ac.cr/pluginfile.php/584585/course/overviewfiles/ITI-721-G1.png)

## Descripción
Este proyecto corresponde al trabajo final del curso **Desarrollo de Aplicaciones para Dispositivos Móviles II** de la **Universidad Técnica Nacional**.

El proyecto consiste en el desarrollo de **MindDice**, un juego multijugador inspirado en la serie **El Plan del Diablo**, específicamente en la dinámica de juegos estratégicos basados en dados, predicción y toma de decisiones.

La aplicación permite a múltiples jugadores interactuar en tiempo real, realizando jugadas estratégicas mediante el uso de dados, predicciones y un sistema de puntuación dinámico.

---
## Objetivos del Proyecto

- Desarrollar una aplicación móvil utilizando **React Native**.
- Implementar comunicación en tiempo real mediante **WebSockets**.
- Gestionar y persistir datos del juego utilizando **MongoDB**.
- Aplicar lógica compleja para el manejo de reglas, turnos y puntuación.
- Diseñar una interfaz intuitiva con temática **medieval/prisión**.
- Simular un juego multijugador con interacción sincronizada.

---
## Tecnologías Utilizadas

- **Framework:** React Native  
- **Lenguaje:** TypeScript / JavaScript  
- **IDE:** Visual Studio Code | Android Studio  
- **Backend:** Node.js (WebSocket)  
- **Base de datos:** MongoDB  
- **Control de versiones:** Git & GitHub  

---
##  Funcionalidades Principales

-  Sistema de tiradas con 11 dados (visibles y ocultos)
-  Sistema de predicción (ZERO, MIN, MORE, MAX)
-  Selección estratégica de combinaciones de dados
-  Sistema de puntuación con ranking por ronda
-  Gestión dinámica de turnos según desempeño
-  Soporte para múltiples jugadores (4 jugadores)
-  Actualización en tiempo real mediante WebSockets
- Visualización de resultados y estadísticas

---
##  Lógica del Juego (Resumen)

- El juego se desarrolla en **4 rondas**.
- Cada jugador realiza **3 combinaciones** por ronda.
- Se evalúan combinaciones:
  - Triple
  - Escalera
  - Doble
- Se asignan puntos según posición:
  - 1er lugar: 6 pts  
  - 2do lugar: 3 pts  
  - 3er lugar: 1 pt
  - 4to lugar: 0 pt   
- Sistema de predicción otorga **bonificaciones**.
- Manejo de empates con distribución de puntos.

---
## Integrantes del Equipo

- **Esteban Amores Barrantes**  
- **Marco Campos Torres**  
- **Jorjan Alvarez Alvarado**   
- **Laura Montero Carvajal**   
- **Carlos Andrés Arias Miranda**  

---

## Creacion del Aplicativo

###  1. Crear el proyecto

```bash
npx @react-native-community/cli@latest init MindDice --version 0.84.0
```

### 2. Acceder al proyecto y Generar artefactos nativos

```bash
cd MindDice
cd android
./gradlew generateCodegenArtifactsFromSchema
```

### 3. Ejecutar la aplicación

```bash
cd ..
npx react-native run-android
```

## Estructura del Proyecto 

El proyecto está organizado siguiendo buenas prácticas de desarrollo:

```
- components/ → Componentes reutilizables
- views/ → Pantallas principales
- services/ → Lógica del juego y comunicación
- store/ → Manejo de estado
- assets/ → Recursos visuales
- styles/ → Estilos globales
```

### Posible Estructura
```
MindDice/
├── android/                          # Configuración nativa Android
├── ios/                              # Configuración nativa iOS
├── localStorage/
│   └── NativeLocalStorage.tsx        # Manejo de almacenamiento local (tokens, sesión)
├── src/
│   ├── assets/                      # Recursos visuales
│   │   ├── images/                  # Dados, UI medieval, prisión
│   │   ├── icons/
│   │   └── sounds/                  # (opcional: sonidos de dados)
│   ├── components/                  # Componentes reutilizables
│   │   ├── config/
│   │   │   └── SocketConfig.ts      # Configuración WebSocket
│   │   ├── common/                  # Componentes genéricos
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Loader.tsx
│   │   ├── game/                    # Componentes específicos del juego
│   │   │   ├── DiceComponent.tsx            # Render de un dado
│   │   │   ├── DiceRoller.tsx               # Tirar dados
│   │   │   ├── DiceSelector.tsx             # Seleccionar 3 dados
│   │   │   ├── HiddenDice.tsx               # Dados ocultos (rojo/azul)
│   │   │   ├── CombinationDisplay.tsx       # Muestra jugada (triple, doble, etc)
│   │   │   ├── ScoreBoard.tsx               # Puntajes en vivo
│   │   │   ├── TurnIndicator.tsx            # De quién es el turno
│   │   │   └── PredictionCardSelector.tsx   # Selección de predicción
│   │   ├── lobby/
│   │   │   ├── PlayerList.tsx       # Lista de jugadores
│   │   │   ├── RoomStatus.tsx       # Estado de la sala
│   │   │   └── StartGameButton.tsx
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Footer.tsx
│   │   └── auth/
│   │       └── LoginComponent.tsx
│   ├── services/                   # Lógica de conexión y datos
│   │   ├── api/
│   │   │   └── GameService.ts       # (opcional REST)
│   │   ├── socket/
│   │   │   ├── SocketService.ts     # Conexión WebSocket
│   │   │   └── GameSocketEvents.ts  # Eventos (turnos, tiradas, etc)
│   │   ├── game/
│   │   │   ├── GameEngine.ts        # LÓGICA CENTRAL DEL JUEGO
│   │   │   ├── ScoreCalculator.ts   # Cálculo de puntos
│   │   │   ├── CombinationChecker.ts # Detecta triple, doble, escalera
│   │   │   ├── TurnManager.ts       # Manejo de turnos
│   │   │   └── PredictionService.ts # Validación de predicciones
│   │   └── storage/
│   │       └── LocalStorageService.ts
│   ├── store/                      # Manejo de estado global
│   │   ├── GameStore.ts            # Estado del juego
│   │   ├── PlayerStore.ts          # Jugadores
│   │   └── SocketStore.ts
│   ├── styles/
│   │   ├── GlobalStyles.ts
│   │   ├── GameStyles.ts
│   │   └── Theme.ts                # 🎨 medieval/prisión
│   └── views/                      # Pantallas principales
│       ├── LoginView.tsx
│       ├── LobbyView.tsx           # Sala de espera
│       ├── GameView.tsx            # Pantalla principal del juego
│       ├── DiceSelectionView.tsx   # Selección de jugadas
│       ├── ResultView.tsx          # Resultados de ronda
│       └── ScoreboardView.tsx      # Puntajes finales
├── App.tsx
├── package.json

```
