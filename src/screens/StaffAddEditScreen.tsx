import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, StyleSheet, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchStaffDetail, createStaff, saveStaff } from '../redux/actions/staffActions';
import i from '../utils/i18n_local';
import config from '../config';

const StaffAddEditScreen = ({ route, navigation }) => {
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
    image: null,
  });

  useEffect(() => {
    if (staffId) {
      dispatch(fetchStaffDetail(staffId));
    }
  }, [dispatch, staffId]);

  useEffect(() => {
    if (staffDetail && staffId) {
      setFormData({
        name: staffDetail.name || '',
        job_title: staffDetail.job_title || '',
        position: staffDetail.position || '',
        email: staffDetail.email || '',
        status: staffDetail.status || '',
        gender: staffDetail.gender || '',
        short_description: staffDetail.short_description || '',
        country: staffDetail.country || '',
        state: staffDetail.state || '',
        city: staffDetail.city || '',
        zipcode: staffDetail.zipcode || '',
        address: staffDetail.address || '',
        image: staffDetail.main_pair?.icon?.image_path 
          ? { uri: `${config.siteUrl}${staffDetail.main_pair.icon.image_path}` }
          : null,
      });
    }
  }, [staffDetail, staffId]);

  const handleInputChange = (name, value) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setFormData(prevData => ({
          ...prevData,
          image: { 
            uri: response.assets[0].uri,
            type: response.assets[0].type,
            name: response.assets[0].fileName,
          },
        }));
      }
    });
  };

  const handleSubmit = async () => {
    try {
      if (staffId) {
        await dispatch(saveStaff(formData, staffId));
      } else {
        await dispatch(createStaff(formData));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error',
        `Failed to save staff: ${error.message}`,
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Button title={i.t('Save')} onPress={handleSubmit} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
          {formData.image ? (
            <Image 
              source={{ uri: formData.image.uri }}
              style={styles.image}
            />
          ) : (
            <Text style={styles.imagePlaceholder}>{i.t('Tap to select image')}</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.label}>{i.t('Name:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.name}
          onChangeText={(text) => handleInputChange('name', text)}
        />
        <Text style={styles.label}>{i.t('Job Title:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.job_title}
          onChangeText={(text) => handleInputChange('job_title', text)}
        />
        <Text style={styles.label}>{i.t('Position:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.position}
          onChangeText={(text) => handleInputChange('position', text)}
        />
        <Text style={styles.label}>{i.t('Email:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
        />
        <Text style={styles.label}>{i.t('Status:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.status}
          onChangeText={(text) => handleInputChange('status', text)}
        />
        <Text style={styles.label}>{i.t('Gender:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.gender}
          onChangeText={(text) => handleInputChange('gender', text)}
        />
        <Text style={styles.label}>{i.t('Short description:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.short_description}
          onChangeText={(text) => handleInputChange('short_description', text)}
        />
        <Text style={styles.label}>{i.t('Country:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.country}
          onChangeText={(text) => handleInputChange('country', text)}
        />
        <Text style={styles.label}>{i.t('State:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.state}
          onChangeText={(text) => handleInputChange('state', text)}
        />
        <Text style={styles.label}>{i.t('City:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.city}
          onChangeText={(text) => handleInputChange('city', text)}
        />
        <Text style={styles.label}>{i.t('Zipcode:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.zipcode}
          onChangeText={(text) => handleInputChange('zipcode', text)}
        />
        <Text style={styles.label}>{i.t('Address:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.address}
          onChangeText={(text) => handleInputChange('address', text)}
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
  imageContainer: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    textAlign: 'center',
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

export default StaffAddEditScreen;