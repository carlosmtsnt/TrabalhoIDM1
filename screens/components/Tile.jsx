import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

const Tile = ({ color, onPress }) => {
  const tileColor = color || 'white'; 

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.tile, { backgroundColor: tileColor }]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tile: {
    width: 50,
    height: 50,
    margin: 2,
    borderRadius: 25,
  },
});

export default Tile;
