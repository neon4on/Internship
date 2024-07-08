import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { fetchStaffDetail } from '../redux/actions/staffActions';
import i from '../utils/i18n_local';
import config from '../config';

const { width } = Dimensions.get('window');
const imageSize = width - 32;

const StaffDetailScreen = ({ route, navigation }) => {
  const { staffId } = route.params;
  const dispatch = useDispatch();
  const { detail: staffDetail, loading, error } = useSelector((state) => state.staff);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchStaffDetail(staffId));
  }, [dispatch, staffId]);

  useEffect(() => {
    if (staffDetail && staffDetail.main_pair && staffDetail.main_pair.icon && staffDetail.main_pair.icon.image_path) {
      const imagePath = staffDetail.main_pair.icon.image_path;
      const fullImageUrl = `${config.siteUrl}${imagePath}`;
      setImageUrl(fullImageUrl);
      console.log('Full Image URL:', fullImageUrl);
    } else {
      console.log('Staff detail or image path is missing:', staffDetail);
    }
  }, [staffDetail]);

  const handleEdit = () => {
    navigation.navigate('StaffAddEditScreen', { staffId });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
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

  if (!staffDetail) {
    return (
      <View style={styles.container}>
        <Text>No staff details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title={i.t('Edit')} onPress={handleEdit} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imageContainer}>
          {imageUrl ? (
            <Image 
              source={{ uri: imageUrl }} 
              style={styles.image}
              resizeMode="cover"
              onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
            />
          ) : (
            <View style={styles.placeholder}>
              <Text>{i.t('No Image Available')}</Text>
            </View>
          )}
        </View>
        <Text style={styles.label}>{i.t('Name:')}</Text>
        <Text style={styles.value}>{staffDetail.name}</Text>
        <Text style={styles.label}>{i.t('Job Title:')}</Text>
        <Text style={styles.value}>{staffDetail.job_title}</Text>
        <Text style={styles.label}>{i.t('Email:')}</Text>
        <Text style={styles.value}>{staffDetail.email}</Text>
        <Text style={styles.label}>{i.t('Position:')}</Text>
        <Text style={styles.value}>{staffDetail.position}</Text>
        <Text style={styles.label}>{i.t('Status:')}</Text>
        <Text style={styles.value}>{staffDetail.status}</Text>
        <Text style={styles.label}>{i.t('Gender:')}</Text>
        <Text style={styles.value}>{staffDetail.gender}</Text>
        <Text style={styles.label}>{i.t('Short description:')}</Text>
        <Text style={styles.value}>{staffDetail.short_description}</Text>
        <Text style={styles.label}>{i.t('Lang_code:')}</Text>
        <Text style={styles.value}>{staffDetail.lang_code}</Text>
        <Text style={styles.label}>{i.t('Country:')}</Text>
        <Text style={styles.value}>{staffDetail.country}</Text>
        <Text style={styles.label}>{i.t('State:')}</Text>
        <Text style={styles.value}>{staffDetail.state}</Text>
        <Text style={styles.label}>{i.t('City:')}</Text>
        <Text style={styles.value}>{staffDetail.city}</Text>
        <Text style={styles.label}>{i.t('Zipcode:')}</Text>
        <Text style={styles.value}>{staffDetail.zipcode}</Text>
        <Text style={styles.label}>{i.t('Address:')}</Text>
        <Text style={styles.value}>{staffDetail.address}</Text>
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
    width: imageSize,
    height: imageSize,
    marginBottom: 16,
    alignSelf: 'center',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
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