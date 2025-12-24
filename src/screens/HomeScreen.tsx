import React, { useState, useMemo } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  FlatList, 
  Text, 
  Dimensions, 
  TouchableOpacity, 
  SafeAreaView, 
  Platform,
  Modal,
  ScrollView
} from 'react-native';
import { Image } from 'expo-image';

// Import de tes données
import moviesDataRaw from '../data/data.json';
import allImages from '../data/images';

const { width, height } = Dimensions.get('window');

const getNumColumns = () => {
  if (Platform.OS === 'web') {
    if (width > 1200) return 6;
    if (width > 800) return 4;
    return 3;
  }
  return 3;
};

interface Movie {
  titre: string;
  annee: string;
  genres: string;
  acteurs: string;
  synopsis: string;
  affiche: string;
}

const moviesData = moviesDataRaw as Movie[];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const numColumns = getNumColumns();

  // MISE À JOUR : On cherche maintenant dans titre, acteurs ET genres
  const filteredMovies = useMemo(() => {
    const searchLower = search.toLowerCase();
    return moviesData.filter(m => 
      m.titre.toLowerCase().includes(searchLower) || 
      m.acteurs.toLowerCase().includes(searchLower) ||
      m.genres.toLowerCase().includes(searchLower)
    );
  }, [search]);

  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={styles.card}
      onPress={() => setSelectedMovie(item)}
    >
      <Image 
        source={(allImages as any)[item.affiche]} 
        style={styles.poster}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={2}>{item.titre}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MA VIDÉOTHÈQUE PWA</Text>
        <TextInput 
          style={styles.searchBar} 
          placeholder="Rechercher par titre, acteur ou genre..." 
          placeholderTextColor="#888"
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item, index) => item.titre + index}
        renderItem={renderItem}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={12}
      />

      {/* MODAL DE DETAILS */}
      <Modal
        visible={!!selectedMovie}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedMovie(null)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setSelectedMovie(null)}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            <ScrollView>
              <Image 
                source={selectedMovie ? (allImages as any)[selectedMovie.affiche] : null} 
                style={styles.modalPoster}
                contentFit="contain"
              />
              <View style={styles.modalDetails}>
                <Text style={styles.modalTitle}>{selectedMovie?.titre}</Text>
                <Text style={styles.modalInfo}>{selectedMovie?.annee} | {selectedMovie?.genres}</Text>
                <Text style={styles.modalSubTitle}>Acteurs:</Text>
                <Text style={styles.modalText}>{selectedMovie?.acteurs}</Text>
                <Text style={styles.modalSubTitle}>Synopsis:</Text>
                <Text style={styles.modalText}>{selectedMovie?.synopsis}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { paddingTop: 50, paddingBottom: 20, alignItems: 'center' },
  headerText: { color: '#E50914', fontSize: 22, fontWeight: 'bold' },
  searchBar: { backgroundColor: '#1c1c1c', color: '#fff', width: '90%', padding: 12, borderRadius: 10, marginTop: 10 },
  listContent: { paddingHorizontal: 5 },
  card: { flex: 1, margin: 5, backgroundColor: '#111', borderRadius: 5 },
  poster: { width: '100%', aspectRatio: 2/3 },
  titleContainer: { padding: 5, height: 40, justifyContent: 'center' },
  title: { color: '#fff', fontSize: 10, textAlign: 'center' },
  
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111',
    width: Platform.OS === 'web' ? '50%' : '90%',
    maxHeight: '80%',
    borderRadius: 10,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  modalPoster: { width: '100%', height: 300, marginTop: 20 },
  modalDetails: { padding: 20 },
  modalTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 5 },
  modalInfo: { color: '#888', fontSize: 14, marginBottom: 15 },
  modalSubTitle: { color: '#E50914', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  modalText: { color: '#fff', fontSize: 14, lineHeight: 20, marginTop: 5 },
});