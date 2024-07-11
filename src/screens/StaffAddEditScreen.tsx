import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Button, StyleSheet, Text, TextInput, View, ScrollView, 
  Image, TouchableOpacity, Alert, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
    status: 'A',
    gender: 'M',
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
        status: staffDetail.status || 'A',
        gender: staffDetail.gender || 'M',
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

  const validateForm = () => {
    const requiredFields = ['name', 'job_title', 'email'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      Alert.alert('Error', `Please fill in the following fields: ${missingFields.join(', ')}`);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

        <Text style={styles.label}>{i.t('Email:')}</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={(text) => handleInputChange('email', text)}
          keyboardType="email-address"
        />

        <Text style={styles.label}>{i.t('Status:')}</Text>
        <Picker
          selectedValue={formData.status}
          style={styles.picker}
          onValueChange={(itemValue) => handleInputChange('status', itemValue)}
        >
          <Picker.Item label="Active" value="A" />
          <Picker.Item label="Disabled" value="D" />
        </Picker>

        <Text style={styles.label}>{i.t('Gender:')}</Text>
        <Picker
          selectedValue={formData.gender}
          style={styles.picker}
          onValueChange={(itemValue) => handleInputChange('gender', itemValue)}
        >
          <Picker.Item label="Male" value="M" />
          <Picker.Item label="Female" value="F" />
        </Picker>

        <Text style={styles.label}>{i.t('Short description:')}</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={formData.short_description}
          onChangeText={(text) => handleInputChange('short_description', text)}
          multiline
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
        <Button title={i.t('Save')} onPress={handleSubmit} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    marginBottom: 16,
  },
});

export default StaffAddEditScreen;