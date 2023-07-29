import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Home = () => {
  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('Jogo');
  };


  const handleHistorico = () => {
    navigation.navigate('Historico'); // Navigates to the "Historico" screen
  };

  return (
    <View style={styles.container}>
      <Button title="Start Game" onPress={handleStartGame} style={styles.button} />
      <View style={styles.spacing} />
      <Button title="Historico" onPress={handleHistorico} style={styles.button} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginBottom: 10, // Add margin at the bottom of the buttons
  },
  spacing: {
    height: 10, // Add some space between the buttons using an empty view with height
  },
});

export default Home;
