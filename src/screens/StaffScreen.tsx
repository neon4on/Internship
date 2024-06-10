import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import StaffList from '../components/StaffList';
// import StaffDetail from '../components/StaffDetail';
import { Button, StyleSheet, Text, View, FlatList } from 'react-native';
const Stack = createStackNavigator();

const StaffScreen = () => {
  return (
    <>
    <View style={styles.container}>
      <Text>Hi</Text>
      <Button title="Добавить Staff" onPress={() => navigation.navigate('Staff')} />
      {/* <FlatList
        data={reviews}
        keyExtractor={(item) => item.post_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewAuthor}>{item.name}</Text>
            <Text style={styles.reviewText}>{item.message}</Text>
          </View>
        )}
      /> */}
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  reviewItem: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#333',
  },
});

export default StaffScreen;
