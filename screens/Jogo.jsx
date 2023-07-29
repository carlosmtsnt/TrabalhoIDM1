import React, { useState, useEffect } from 'react';
import { Text, View, Alert, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Tile from './components/Tile';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MATCH_HISTORY_KEY = '@match_history'; // Define the match history key for AsyncStorage

const Jogo = () => {
  const navigation = useNavigation();

  const [board, setBoard] = useState([
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
    Array(7).fill(null),
  ]);

  const [currentPlayer, setCurrentPlayer] = useState('red'); // 'red' or 'yellow', for example
  const [gameStatus, setGameStatus] = useState('playing');
  const [matchNumber, setMatchNumber] = useState(1); // Initial match number

  useEffect(() => {
    const loadMatchHistory = async () => {
      try {
        const storedMatchHistory = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
        if (storedMatchHistory !== null) {
          const matchHistory = JSON.parse(storedMatchHistory);
          setMatchNumber(matchHistory.length + 1); // Set the match number based on the number of matches in the history
        }
      } catch (error) {
        console.log('Error loading match history: ', error);
      }
    };

    loadMatchHistory();
  }, []);

  useEffect(() => {
    if (gameStatus === 'playing') {
      checkWin();
    }
  }, [board, gameStatus]);

  const handleTilePress = (col) => {
    if (gameStatus === 'playing') {
      const updatedBoard = [...board];
      let row;

      for (let r = board.length - 1; r >= 0; r--) {
        if (!updatedBoard[r][col]) {
          row = r;
          updatedBoard[r][col] = currentPlayer;
          break;
        }
      }

      if (row !== undefined) {
        setBoard(updatedBoard);
        setCurrentPlayer(currentPlayer === 'red' ? 'blue' : 'red');
      }
    }
  };

  const checkWin = () => {
    // Check horizontal win
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c <= board[0].length - 4; c++) {
        if (
          board[r][c] &&
          board[r][c] === board[r][c + 1] &&
          board[r][c] === board[r][c + 2] &&
          board[r][c] === board[r][c + 3]
        ) {
          handleGameEnd(board[r][c]);
          return;
        }
      }
    }

    // Check vertical win
    for (let r = 0; r <= board.length - 4; r++) {
      for (let c = 0; c < board[0].length; c++) {
        if (
          board[r][c] &&
          board[r][c] === board[r + 1][c] &&
          board[r][c] === board[r + 2][c] &&
          board[r][c] === board[r + 3][c]
        ) {
          handleGameEnd(board[r][c]);
          return;
        }
      }
    }

    // Check diagonal (top-left to bottom-right) win
    for (let r = 0; r <= board.length - 4; r++) {
      for (let c = 0; c <= board[0].length - 4; c++) {
        if (
          board[r][c] &&
          board[r][c] === board[r + 1][c + 1] &&
          board[r][c] === board[r + 2][c + 2] &&
          board[r][c] === board[r + 3][c + 3]
        ) {
          handleGameEnd(board[r][c]);
          return;
        }
      }
    }

    // Check diagonal (top-right to bottom-left) win
    for (let r = 0; r <= board.length - 4; r++) {
      for (let c = 3; c < board[0].length; c++) {
        if (
          board[r][c] &&
          board[r][c] === board[r + 1][c - 1] &&
          board[r][c] === board[r + 2][c - 2] &&
          board[r][c] === board[r + 3][c - 3]
        ) {
          handleGameEnd(board[r][c]);
          return;
        }
      }
    }

    // Check for draw
    if (board.every((row) => row.every((tile) => tile))) {
      handleGameEnd('draw');
    }
  };

  const handleGameEnd = (winner) => {
    if (winner === 'draw') {
      setGameStatus('draw');
      Alert.alert('Game Over', 'It\'s a draw!', [{ text: 'OK', onPress: resetGame }]);
    } else {
      const capitalizedWinner = winner.charAt(0).toUpperCase() + winner.slice(1);
      setGameStatus('win');

      // Save the match history to AsyncStorage
      const saveMatchHistory = async () => {
        try {
          const storedMatchHistory = await AsyncStorage.getItem(MATCH_HISTORY_KEY);
          const matchHistory = storedMatchHistory ? JSON.parse(storedMatchHistory) : [];
          matchHistory.push({ match: matchNumber, winner: capitalizedWinner });
          await AsyncStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(matchHistory));
        } catch (error) {
          console.log('Error saving match history: ', error);
        }
      };

      saveMatchHistory(); // Save the match history when the game ends

      Alert.alert('Game Over', `${capitalizedWinner} wins!`, [
        {
          text: 'OK',
          onPress: () => {
            resetGame();
            setMatchNumber(matchNumber + 1); // Increment match number for the next match
            navigation.navigate('Historico', { winner: capitalizedWinner }); // Pass the winner to Historico screen
          },
        },
      ]);
    }
  };

  const resetGame = () => {
    setBoard([
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
      Array(7).fill(null),
    ]);
    setCurrentPlayer('red');
    setGameStatus('playing');
  };

  return (
    <View style={styles.container}>
      {board.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((color, colIndex) => (
            <Tile
              key={colIndex}
              color={color || '#003366'} // Dark blue for non-empty tiles, even darker blue for empty tiles
              onPress={() => handleTilePress(colIndex)}
            />
          ))}
        </View>
      ))}
      <Text style={styles.matchText}>{`Match ${matchNumber}`}</Text>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#001f4d', // Dark blue for the board background
  },
  row: {
    flexDirection: 'row',
  },
  matchText: {
    fontSize: 20,
    marginTop: 20,
    color: 'white', // Match number text color is white
  },
});

export default Jogo;