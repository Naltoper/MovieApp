import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions, Platform } from 'react-native';

// On calcule la largeur pour avoir un affichage adaptatif (Grille)
const { width } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const cardWidth = isWeb ? 180 : (width / 2) - 15;

export default function MovieCard({ movie, imageSource }) {
  return (
    <View style={styles.card}>
      <Image 
        source={imageSource} 
        style={styles.poster} 
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{movie.titre}</Text>
        <Text style={styles.year}>{movie.annee}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    margin: 7,
    backgroundColor: '#1a1a1a',
    borderRadius: 4,
    overflow: 'hidden',
    // Ombre pour iOS/Android
    elevation: 5,
    // Ombre pour Web
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5, // Ratio affiche standard
  },
  info: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  year: {
    color: '#e50914', // Rouge style Netflix
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});