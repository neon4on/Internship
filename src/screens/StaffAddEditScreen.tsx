import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { fetchStaffDetail, createStaff, saveStaff } from '../redux/actions/staffActions';

const AddEditStaffScreen = ({ route, navigation }) => {
  const { staffId } = route.params || {};
  const dispatch = useDispatch();
  const { detail: staffDetail, loading, error } = useSelector((state) => state.staff);
  const [formData, setFormData] = useState({
    name: '',
    job_title: '',
    position: '',
    email: '',
    status: '',
    gender: '',
    short_description: '',
    country: '',
    state: '',
    city: '',
    zipcode: '',
    address: '',
    image_path: '',
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
        job_title: staffDetail.job_title,
        position: staffDetail.position,
        email: staffDetail.email,
        status: staffDetail.status,
        gender: staffDetail.gender,
        short_description: staffDetail.short_description,
        country: staffDetail.country,
        state: staffDetail.state,
        city: staffDetail.city,
        zipcode: staffDetail.zipcode,
        address: staffDetail.address,
        image_path: staffDetail.image_path,
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
      dispatch(saveStaff({ ...formData, id: staffId }));
    } else {
      dispatch(createStaff(formData));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Button title="Save" onPress={handleSubmit} style={styles.saveButton} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <Text style={styles.label}>Job Title:</Text>
        <TextInput
          style={styles.input}
          value={formData.job_title}
          onChangeText={(text) => handleInputChange('job_title', text)}
        />
        <Text style={styles.label}>Position:</Text>
        <TextInput
          style={styles.input}
          value={formData.position}
          onChangeText={(text) => handleInputChange('position', text)}
        />
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <Text style={styles.label}>Status:</Text>
        <TextInput
          style={styles.input}
          value={formData.status}
          onChangeText={(text) => handleInputChange('status', text)}
        />
        <Text style={styles.label}>Gender:</Text>
        <TextInput
          style={styles.input}
          value={formData.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
        />
        <Text style={styles.label}>Short Description:</Text>
        <TextInput
          style={styles.input}
          value={formData.short_description}
          onChangeText={(text) => handleInputChange('short_description', text)}
        />
        <Text style={styles.label}>Country:</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => handleInputChange('country', text)}
        />
        <Text style={styles.label}>State:</Text>
        <TextInput
          style={styles.input}
          value={formData.state}
          onChangeText={(text) => handleInputChange('state', text)}
        />
        <Text style={styles.label}>City:</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
        <Text style={styles.label}>Zip Code:</Text>
        <TextInput
          style={styles.input}
          value={formData.zipcode}
          onChangeText={(text) => handleInputChange('zipcode', text)}
        />
        <Text style={styles.label}>Address:</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
        />
        <Text style={styles.label}>Image Path:</Text>
        <TextInput
          style={styles.input}
          value={formData.image_path}
          onChangeText={(text) => handleInputChange('image_path', text)}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
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
  saveButton: {
    marginBottom: 16,
  },
});

export default AddEditStaffScreen;
