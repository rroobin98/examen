import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, FlatList, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalorieCountScreen = () => {
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [meal, setMeal] = useState('');
  const [calorieList, setCalorieList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const loadCalorieList = async () => {
      try {
        const storedCalorieList = await AsyncStorage.getItem('calorieList');
        if (storedCalorieList) {
          const parsedCalorieList = JSON.parse(storedCalorieList);
          if (Array.isArray(parsedCalorieList)) {
            setCalorieList(parsedCalorieList);
          } else {
            setCalorieList([]);
          }
        }
      } catch (error) {
        console.error("Failed to load calorie list from storage", error);
        setCalorieList([]);
      }
    };
    loadCalorieList();
  }, []);

  useEffect(() => {
    const saveCalorieList = async () => {
      try {
        await AsyncStorage.setItem('calorieList', JSON.stringify(calorieList));
      } catch (error) {
        console.error("Failed to save calorie list to storage", error);
      }
    };
    saveCalorieList();
  }, [calorieList]);

  const handleAddMeal = () => {
    if (meal && calories && protein) {
      const date = new Date().toLocaleDateString();
      setCalorieList([...calorieList, { meal, calories: parseInt(calories), protein: parseInt(protein), date }]);
      setMeal('');
      setCalories('');
      setProtein('');
      setModalVisible(false);
    }
  };

  const handleRemoveMeal = (index) => {
    const newCalorieList = [...calorieList];
    newCalorieList.splice(index, 1);
    setCalorieList(newCalorieList);
  };

  const totalCalories = calorieList.reduce((total, item) => total + item.calories, 0);
  const totalProtein = calorieList.reduce((total, item) => total + item.protein, 0);

  const handleSaveDailyTotals = async () => {
    const date = new Date().toLocaleDateString();
    const dailyTotals = { date, totalCalories, totalProtein };
    const storedDailyTotals = await AsyncStorage.getItem('dailyTotals');
    const parsedDailyTotals = storedDailyTotals ? JSON.parse(storedDailyTotals) : [];

    const index = parsedDailyTotals.findIndex(item => item.date === date);
    if (index !== -1) {
      parsedDailyTotals[index].totalCalories = totalCalories;
      parsedDailyTotals[index].totalProtein = totalProtein;
    } else {
      parsedDailyTotals.push(dailyTotals);
    }

    await AsyncStorage.setItem('dailyTotals', JSON.stringify(parsedDailyTotals));
  };

  return (
    <ImageBackground source={require('../assets/backgroundfav.jpeg')} style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.title}>Calorie Counter</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Meal</Text>
        </TouchableOpacity>
        <FlatList
          style={styles.listContainer}
          data={calorieList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View key={index} style={styles.listItem}>
              <View>
                <Text style={styles.mealText}>{item.meal}</Text>
                <Text style={styles.dateText}>{item.date}</Text>
              </View>
              <View style={styles.listItemRight}>
                <Text style={styles.caloriesText}>{item.calories} kcal</Text>
                <Text style={styles.proteinText}>{item.protein} g</Text>
                <TouchableOpacity onPress={() => handleRemoveMeal(index)}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
        <Text style={styles.totalText}>Total Calories: {totalCalories} kcal</Text>
        <Text style={styles.totalText}>Total Protein: {totalProtein} g</Text>
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveDailyTotals}>
          <Text style={styles.saveButtonText}>Save Daily Totals</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Add Meal</Text>
            <TextInput
              style={styles.input}
              placeholder="Meal"
              value={meal}
              onChangeText={setMeal}
            />
            <TextInput
              style={styles.input}
              placeholder="Calories"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
            <TextInput
              style={styles.input}
              placeholder="Protein (g)"
              keyboardType="numeric"
              value={protein}
              onChangeText={setProtein}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleAddMeal}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  addButton: {
    backgroundColor: '#008000',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  listContainer: {
    width: '100%',
    marginVertical: 20,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  mealText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 14,
    color: '#888888',
  },
  listItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caloriesText: {
    fontSize: 16,
    marginRight: 10,
  },
  proteinText: {
    fontSize: 16,
    marginRight: 10,
  },
  removeText: {
    fontSize: 14,
    color: '#FF0000',
    textDecorationLine: 'underline',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#ffffff',
    textShadowColor: '#000000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  saveButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 100,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#008000',
    padding: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CalorieCountScreen;
