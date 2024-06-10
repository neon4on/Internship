import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { fetchStaff } from '../redux/actions/staffActions';

const StaffScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: staffList, loading, error } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text> { 'Hi :)' } </Text>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('StaffDetail', { staffId: item.id })}>
      <View style={styles.staffItem}>
        <Text style={styles.staffName}>{item.name}</Text>
        <Text style={styles.staffPosition}>{item.position}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button title="Добавить Staff" onPress={() => navigation.navigate('AddEditStaff')} />
      <FlatList
        data={staffList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  staffItem: {
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
  staffName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  staffPosition: {
    fontSize: 14,
    color: '#333',
  },
});

export default StaffScreen;
