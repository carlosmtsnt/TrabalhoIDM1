import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATCH_HISTORY_KEY = '@match_history'; 

const Historico = () => {
  const [matchHistory, setMatchHistory] = useState([]);

  useEffect(() => {
    const loadMatchHistory = async () => {
      try {
        const storedMatchHistory = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
        if (storedMatchHistory !== null) {
          setMatchHistory(JSON.parse(storedMatchHistory));
        }
      } catch (error) {
        console.log('Error loading match history: ', error);
      }
    };

    loadMatchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Match History</Text>
      <Text></Text>
      {matchHistory.map((match, index) => (
        <Text key={index}>{`Match ${index + 1}: Winner - ${match.winner}`}</Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Historico;
