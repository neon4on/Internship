import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { fetchStaffDetail } from '../redux/actions/staffActions';

const StaffDetailScreen = ({ route, navigation }) => {
  const { staffId } = route.params;
  const dispatch = useDispatch();
  const { detail: staffDetail, loading, error } = useSelector((state) => state.staff);

  useEffect(() => {
    dispatch(fetchStaffDetail(staffId));
  }, [dispatch, staffId]);

  const handleEdit = () => {
    navigation.navigate('AddEditStaff', { staffId });
  };

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
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: staffDetail.image }} style={styles.image} />
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{staffDetail.name}</Text>

      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{staffDetail.email}</Text>

      <Text style={styles.label}>Position:</Text>
      <Text style={styles.value}>{staffDetail.position}</Text>

      <Text style={styles.label}>Country:</Text>
      <Text style={styles.value}>{staffDetail.country}</Text>
      
      <Button title="Edit" onPress={handleEdit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
  },
  value: {
    fontSize: 16,
  },
});

export default StaffDetailScreen;
