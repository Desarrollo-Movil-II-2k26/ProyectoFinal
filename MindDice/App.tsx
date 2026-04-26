import React, { useEffect } from 'react';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GameProvider, useGame } from './src/store/GameContext';
import { socketService } from './src/services/SocketService'; 

import WelcomeView       from './src/views/WelcomeView';
import HomeView          from './src/views/HomeView';
import LobbyView         from './src/views/LobbyView';
import GameView          from './src/views/GameView';
import DiceSelectionView from './src/views/DiceSelectionView';
import RoundResultView   from './src/views/RoundResultView';
import FinalScoreView    from './src/views/FinalScoreView';
import RulesView         from './src/views/RulesView';

export type RootStack = {
  Welcome:       undefined;
  Home:          { playerName: string };
  Lobby:         { playerName: string; roomCode: string };
  Game:          { playerName: string; roomCode: string };
  DiceSelection: undefined;
  RoundResult:   { round: number };
  FinalScore:    { winnerName: string; finalScores: any[] };
  Rules:         undefined;
};

const Stack = createNativeStackNavigator<RootStack>();

function AppNavigator() {
  const { state, connect, createRoom, joinRoom, startGame, resetGame } = useGame(); // ← FIX 2: resetGame agregado
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (
      state.phase === 'MakingPredictions' ||
      state.phase === 'SelectingDice'
    ) {
      navigation.navigate('Game', {
        playerName: '',
        roomCode:   state.roomCode ?? '',
      });
    }

    if (state.phase === 'ShowingRoundResults' && state.roundResult) {
      navigation.navigate('RoundResult', { round: state.currentRound });
    }
    if (state.phase === 'GameOver' && state.gameOver) {
      navigation.navigate('FinalScore', {
        winnerName:  state.gameOver.winnerName,
        finalScores: state.gameOver.finalScores,
      });
    }
  }, [state.phase]);

  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Welcome">
        {({ navigation }) => (
          <WelcomeView
            onEnter={(playerName) =>
              navigation.navigate('Home', { playerName })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Home">
        {({ navigation, route }) => (
          <HomeView
            playerName={route.params.playerName}
            onCrearSala={async () => {
              //Para conectar con el servidor
              await connect();
              createRoom(route.params.playerName);
              navigation.navigate('Lobby', {
                playerName: route.params.playerName,
                roomCode: state.roomCode ?? '',
              });
            }}
            onUnirse={async (codigo) => {
              //Para conectar con el servidor
              await connect();
              joinRoom(codigo, route.params.playerName);
              navigation.navigate('Lobby', {
                playerName: route.params.playerName,
                roomCode: codigo,
              });
            }}
            onVerReglas={() => navigation.navigate('Rules')}
            onSalir={() => navigation.navigate('Welcome')}
             onChangeName={(nuevoNombre) => {                          // ← AGREGA ESTO
             navigation.setParams({ playerName: nuevoNombre });
      }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Lobby">
        {({ navigation, route }) => (
          <LobbyView
            roomCode={state.roomCode ?? route.params.roomCode}
            players={state.players}
            isLeader={state.isLeader}
            onIniciar={() => {
              startGame();
              navigation.navigate('Game', {
                playerName: route.params.playerName,
                roomCode:   state.roomCode ?? route.params.roomCode,
              });
            }}
            onSalir={() => {
              socketService.leaveRoom(); // ← avisa al servidor que salió de la sala
              resetGame();              // ← FIX 3: limpia estado local
              navigation.navigate('Home', { playerName: route.params.playerName });
            }}
            onVerJuego={() => navigation.navigate('Game', {
              playerName: route.params.playerName,
              roomCode:   state.roomCode ?? route.params.roomCode,
            })}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Game">
        {({ navigation, route }) => (
          <GameView
            onGoToDiceSelection={() => navigation.navigate('DiceSelection')}
            onSalir={() =>
              navigation.navigate('Home', { playerName: route.params.playerName })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="DiceSelection">
        {({ navigation }) => {
          const { state, selectDice } = useGame();
          const myPlayer = state.players.find(p => p.id === state.playerId);

          return (
            <DiceSelectionView
              whiteDice={myPlayer?.white_dice ?? []}
              hiddenDice={state.hiddenDice}
              onConfirm={(msg) => {
                selectDice(msg.white_indices, msg.use_red, msg.use_blue);
                navigation.navigate('Game', {
                  playerName: '',
                  roomCode: state.roomCode ?? '',
                });
              }}
              onSalir={() => navigation.navigate('Game', {
                playerName: '',
                roomCode: state.roomCode ?? '',
              })}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="FinalScore">
        {({ navigation, route }) => (
          <FinalScoreView
            winnerName={route.params.winnerName}
            finalScores={route.params.finalScores}
            onVolver={() => navigation.navigate('Welcome')}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="RoundResult">
        {({ navigation, route }) => (
          <RoundResultView
            round={route.params.round}
            scores={state.roundResult ?? []}
            onContinuar={() =>
              state.phase === 'GameOver'
                ? navigation.navigate('FinalScore', {
                    winnerName:  state.gameOver?.winnerName ?? '',
                    finalScores: state.gameOver?.finalScores ?? [],
                  })
                : navigation.navigate('Game', {
                    playerName: '',
                    roomCode:   state.roomCode ?? '',
                  })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Rules">
        {({ navigation }) => (
          <RulesView onVolver={() => navigation.goBack()} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <GameProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GameProvider>
  );
}