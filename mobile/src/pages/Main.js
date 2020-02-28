import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps'; 
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons'

import api from '../services/api';
import { connect, disconnect, subscribeToNewArtists } from '../services/socket';

function Main({ navigation }) {
  const [artists, setArtists] = useState([]);
  const [currentRegion, setCurrentRegion] = useState(null);
  const [art_types, setArtTypes] = useState('');

  useEffect(() => {
    async function loadInitialPosition() {
      const { granted } = await requestPermissionsAsync();

      if (granted) {
        const { coords } = await getCurrentPositionAsync({
          enableHighAccuracy: true,
        });

        const { latitude, longitude } = coords;

        setCurrentRegion({
          latitude,
          longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        })
      }
    }

    loadInitialPosition();
  }, []);

  useEffect(() => {
    subscribeToNewArtists(artist => setArtists([...artists, artist])); 
  }, [artists]);

  function setupWebSocket() {
    disconnect();

    const { latitude, longitude } = currentRegion;

    connect(
      latitude,
      longitude,
      art_types
    );

    subscribeToNewArtists
  }

  async function loadArtists() {
    const { latitude, longitude } = currentRegion;

    const response  = await api.get('/search', {
      params: {
        latitude,
        longitude,
        art_types
      }
    });

    setArtists(response.data.artists);
    setupWebSocket();
  }

  function handleRegionChanged(region) {
    setCurrentRegion(region);
  }

  if(!currentRegion) {
    return null;
  }

  return (
    <>
    <MapView
      onRegionChangeComplete={handleRegionChanged} 
      initialRegion={currentRegion} 
      style={styles.map}
    >
      {artists.map(artist => (
        <Marker 
          key={artist._id}
          coordinate={{
            latitude: artist.location.coordinates[1], 
            longitude: artist.location.coordinates[0]
          }}
        >
          <Image 
            style={styles.avatar} 
            source={{ uri: artist.avatar_url }} 
          />
       
          <Callout onPress={() => {
            navigation.navigate('Profile', { github_username: artist.github_username });
          }}>
            <View style={styles.callout}>
              <Text style={styles.artistName}>{artist.name}</Text>
              <Text style={styles.artistBio}>{artist.bio}</Text>
              <Text style={styles.artistArtTypes}>{artist.art_types.join(', ')}</Text>
            </View>
          </Callout>
        </Marker>
      ))}
    </MapView>

    <View style={styles.searchForm}>
      <TextInput
       style={styles.searchInput}
       placeholder="Buscar por tipos de arte..."
       placeholderTextColor="#999"
       autoCapitalize="words"
       autoCorrect={false}
       value={art_types}
       onChangeText={setArtTypes}
      />

      <TouchableOpacity onPress={loadArtists} style={styles.loadButton}>
        <MaterialIcons name="my-location" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 4,
    borderWidth: 4,
    borderColor: '#FFF'
  },

  callout: {
    width: 260,
  },

  artistName: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  artistBio: {
    color: '#666',
    marginTop: 5,
  },

  artistArtTypes: {
    marginTop: 5,
  },

  searchForm: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    zIndex: 5,
    flexDirection: 'row',
  },

  searchInput: {
    flex: 1,
    height: 50,
    backgroundColor: '#FFF',
    color: '#333',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {
      width: 4,
      height: 4,
    },
    elevation: 2,
  },

  loadButton: {
    width: 50,
    height: 50,
    backgroundColor: '#8E4DFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
})

export default Main;