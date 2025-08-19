import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Animated,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

import config from '../config/config';

export default function App() {

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [predictedClass, setPredictedClass] = useState<string | null>(null);

  //state for the fade animation
  const fadeAnim = useState(new Animated.Value(0))[0];
  
  //state for the ActivityIndicator
  const [loading, setLoading] = useState(false);
    

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permess denied: please grant camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      //restores default values
      setImageUri(result.assets[0].uri);
      setPredictedClass(null);
      fadeAnim.setValue(0);

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permess denied: please grant camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setPredictedClass(null);
      fadeAnim.setValue(0);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  };

  const predictClass = async () => {
    if (!imageUri) return;

    const formData = new FormData();

    if(Platform.OS === 'web'){
      const response = await fetch(imageUri)
      const blob = await response.blob();
      formData.append("file", blob, "image.jpg")
    } else {
      formData.append('file', {
        uri: imageUri,
        name: 'image.jpg',
        type: 'image/jpeg',
      } as any);
    }
    
    //shows the loading indicator
    setLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/predict`, {
        method: 'POST',
        body: formData, 
      });
      const data = await response.json();
      setPredictedClass(data.class);
    } catch (error) {
      console.error(error);
      alert('Error predicting class');
    } finally {
      setLoading(false);
    }

  };

  //change resultBadge color for each class
  const getColorForClass = (cls: string) => {
    switch (cls) {
      case "plastic":
        return "#FFD60A";
      case "metal":
        return "#A0A0A0";
      case "paper":
        return "#1D4ED8";
      case "trash":
        return "#8B5E3C"; 
      case "glass":
        return "#16A34A";
      default:
        return "#fab010ff"; // cardboard
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Waste Scanner</Text>

      <View style={styles.card}>
        {imageUri && (
          <Animated.Image
            source={{ uri: imageUri }}
            resizeMode="cover"  
            style={[styles.image, { opacity: fadeAnim }]}
          />
        )}
        

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.roundButton} onPress={pickImage}>
            <Ionicons name="images-outline" size={32} color="#fff" />
          </TouchableOpacity>

          {Platform.OS !== 'web' && (
            <TouchableOpacity style={styles.roundButton} onPress={takePhoto}>
              <Ionicons name="camera-outline" size={32} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {loading && (
          <View style={{ marginVertical: 16, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={{ marginTop: 8, fontSize: 16, color: "#555" }}>
              Predicting...
            </Text>
          </View>
        )}

        {imageUri && (
          <TouchableOpacity style={styles.predictButton} onPress={predictClass} disabled={loading == true || imageUri == null}>
            <Ionicons name="search-outline" size={24} color="#fff" />
            <Text style={styles.predictText}>Predict</Text>
          </TouchableOpacity>
        )}

        {!loading && predictedClass && (
          <View style={[
            styles.resultBadge,
            { backgroundColor: getColorForClass(predictedClass) }
            ]}
          >
            <Text style={styles.resultText}>{predictedClass}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f4f7',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  image: {
    width: 220,
    height: 220,
    borderRadius: 12,
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 20,
  },
  roundButton: {
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  predictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  predictText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 15,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
