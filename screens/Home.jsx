import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const Home = () => {
  const navigation = useNavigation();

  const handleStartGame = () => {
    navigation.navigate('Jogo');
  };


  const handleHistorico = () => {
    navigation.navigate('Historico');
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
    marginBottom: 10, 
  },
  spacing: {
    height: 10,
  },
});

export default Home;
