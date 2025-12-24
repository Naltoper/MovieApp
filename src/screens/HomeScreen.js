import React, { useState } from 'react';
import { View, FlatList, TextInput, StyleSheet, SafeAreaView, Text, Platform } from 'react-native';
import moviesData from '../data/data.json';
import images from '../data/images';
import MovieCard from '../components/MovieCard';

export default function HomeScreen() {
  const [search, setSearch] = useState('');

  // Filtrage intelligent : cherche dans le titre, les acteurs et le genre
  const filteredMovies = moviesData.filter(movie => {
    const searchLower = search.toLowerCase();
    return (
      movie.titre.toLowerCase().includes(searchLower) ||
      movie.genres.toLowerCase().includes(searchLower) ||
      movie.acteurs.toLowerCase().includes(searchLower)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>TECH<Text style={{color: '#E50914'}}>FLIX</Text></Text>
        <TextInput
          style={styles.searchBar}
          placeholder="Rechercher un film, un acteur..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <MovieCard movie={item} imageSource={images[item.affiche]} />
        )}
        // Gestion dynamique des colonnes pour le web
        numColumns={Platform.OS === 'web' ? 0 : 2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={Platform.OS !== 'web' ? styles.columnWrapper : null}
        // Optimisations pour 1000 items
        initialNumToRender={12}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414', // Noir Netflix
  },
  header: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#141414',
  },
  logo: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: -1,
  },
  searchBar: {
    height: 45,
    backgroundColor: '#333',
    borderRadius: 5,
    paddingHorizontal: 15,
    color: '#fff',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 20,
    // Sur Web, on utilise Flexbox pour que ça s'aligne proprement
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    flexWrap: Platform.OS === 'web' ? 'wrap' : 'nowrap',
    justifyContent: 'center',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});