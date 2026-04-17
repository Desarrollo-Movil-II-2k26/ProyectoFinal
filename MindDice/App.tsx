import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeView      from './src/views/WelcomeView';
import HomeView         from './src/views/HomeView';
import LobbyView        from './src/views/LobbyView';


export type RootStack = {
  Welcome: undefined;
  Home: { playerName: string };
  Lobby: { playerName: string; roomCode: string };
  Game: undefined;
  DiceSelection: undefined;
  RoundResult: undefined;
  FinalScore: undefined;
};

const Stack = createNativeStackNavigator<RootStack>();


export default function App() {
  return (
    <NavigationContainer>
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
            onCrearSala={() => navigation.navigate('Lobby', { playerName: route.params.playerName, roomCode: 'ABCD' })}
            onUnirse={(codigo) => navigation.navigate('Lobby', { playerName: route.params.playerName, roomCode: codigo })}
            onVerReglas={() => navigation.navigate('RoundResult')}
            onSalir={() => navigation.navigate('Welcome')}
          />
        )}
        </Stack.Screen>
        <Stack.Screen name="Lobby">
        {({ navigation, route }) => (
          <LobbyView
            roomCode={route.params.roomCode}
            players={[]} // aquí deberías pasar la lista real de jugadores desde tu estado global o contexto
            isLeader={true} // o la lógica que determine si el jugador es líder
            onIniciar={() => navigation.navigate('Game')}
            onSalir={() => navigation.navigate('Home', { playerName: route.params.playerName })}
          />
        )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}