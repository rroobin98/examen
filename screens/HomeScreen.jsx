import React from 'react';
import { TouchableOpacity, ImageBackground, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <ImageBackground source={require('../assets/backgroundfav.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#008000', marginBottom: 20 }]}
            onPress={() => {
              navigation.navigate("CalorieCountScreen");
            }}
          >
            <Text style={styles.buttonText}>Macro counter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: '#008000', marginBottom: 20 }]}
            onPress={() => {
              navigation.navigate("DailyTotalsScreen");
            }}
          >
            <Text style={styles.buttonText}>Daily total</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 100,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  buttonContainer: {
    marginBottom: 125,
  },
  button: {
    marginBottom: 20,
    borderRadius: 20, // Increased border radius to make the buttons rounder
    paddingVertical: 20, // Increased padding vertically to make the buttons taller
    paddingHorizontal: 50, // Increased padding horizontally to make the buttons wider
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
