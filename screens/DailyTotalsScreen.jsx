import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DailyTotalsScreen = () => {
  const [dailyTotals, setDailyTotals] = useState([]);

  useEffect(() => {
    const loadDailyTotals = async () => {
      try {
        const storedDailyTotals = await AsyncStorage.getItem('dailyTotals');
        if (storedDailyTotals) {
          const parsedDailyTotals = JSON.parse(storedDailyTotals);
          if (Array.isArray(parsedDailyTotals)) {
            setDailyTotals(parsedDailyTotals);
          } else {
            setDailyTotals([]);
          }
        }
      } catch (error) {
        console.error("Failed to load daily totals from storage", error);
        setDailyTotals([]);
      }
    };
    loadDailyTotals();
  }, []);

  return (
    <ImageBackground 
      source={require('../assets/backgroundfav.jpeg')} 
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Daily Totals</Text>
        <FlatList
          data={dailyTotals}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Text style={styles.dateText}>{item.date}</Text>
              <Text style={styles.totalText}>Calories: {item.totalCalories} kcal</Text>
              <Text style={styles.totalText}>Protein: {item.totalProtein} g</Text>
            </View>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 5,
    marginVertical: 5,
    width: '100%',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  totalText: {
    fontSize: 16,
  },
});

export default DailyTotalsScreen;
