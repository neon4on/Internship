import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { fetchStaffDetail, createStaff, updateStaff } from '../redux/actions/staffActions';

const AddEditStaffScreen = ({ route, navigation }) => {
  const { staffId } = route.params || {};
  const dispatch = useDispatch();
  const { detail: staffDetail, loading, error } = useSelector((state) => state.staff);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    country: '',
    // Добавь остальные поля по аналогии
  });

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffDetail(staffId));
    }
  }, [dispatch, staffId]);

  useEffect(() => {
    if (staffDetail && staffId) {
      setFormData({
        name: staffDetail.name,
        email: staffDetail.email,
        position: staffDetail.position,
        country: staffDetail.country,
        // Добавь остальные поля по аналогии
      });
    }
  }, [staffDetail, staffId]);

  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    if (staffId) {
      dispatch(updateStaff(staffId, formData));
    } else {
      dispatch(createStaff(formData));
    }
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <Text style={styles.label}>Position:</Text>
      <TextInput
        style={styles.input}
        value={formData.position}
        onChangeText={(text) => handleInputChange('position', text)}
      />

      <Text style={styles.label}>Country:</Text>
      <TextInput
        style={styles.input}
        value={formData.country}
        onChangeText={(text) => handleInputChange('country', text)}
      />
      
      <Button title="Save" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 16,
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
});

export default AddEditStaffScreen;
