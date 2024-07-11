import React, { useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, View, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { fetchStaffDetail } from '../redux/actions/staffActions';
import i from '../utils/i18n_local';
import config from '../config';
import HTML from 'react-native-render-html';

const { width } = Dimensions.get('window');
const imageSize = width - 32;

const StaffDetailScreen = ({ route, navigation }) => {
  const { staffId } = route.params;
  const dispatch = useDispatch();
  const { detail: staffDetailData, loading, error } = useSelector((state) => state.staff);
  const [staffDetail, setStaffDetail] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    dispatch(fetchStaffDetail(staffId));
  }, [dispatch, staffId]);

  useEffect(() => {
    if (staffDetailData && staffDetailData.staff && staffDetailData.staff.length > 0) {
      const staff = staffDetailData.staff.find(s => s.staff_id === staffId) || staffDetailData.staff[0];
      setStaffDetail(staff);
      if (staff.main_pair && staff.main_pair.icon && staff.main_pair.icon.https_image_path) {
        setImageUrl(staff.main_pair.icon.https_image_path);
      } else {
        setImageUrl(null);
      }
    }
  }, [staffDetailData, staffId]);

  const handleEdit = useCallback(() => {
    navigation.navigate('StaffAddEditScreen', { staffId });
  }, [navigation, staffId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title={i.t('Edit')} onPress={handleEdit} />
      ),
    });
  }, [navigation, handleEdit]);

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
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!staffDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{i.t('No staff details available')}</Text>
      </View>
    );
  }

  const renderDetailItem = (label, value) => (
    <View style={styles.detailItem}>
      <Text style={styles.label}>{i.t(label)}</Text>
      <Text style={styles.value}>{value !== undefined && value !== null ? value : 'N/A'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
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
      {renderDetailItem('Name', staffDetail.name)}
      {renderDetailItem('Job Title', staffDetail.job_title)}
      {renderDetailItem('Email', staffDetail.email)}
      {renderDetailItem('Position', staffDetail.position)}
      {renderDetailItem('Status', staffDetail.status === 'A' ? 'Active' : 'Inactive')}
      {renderDetailItem('Gender', staffDetail.gender === 'M' ? 'Male' : 'Female')}
      <View style={styles.detailItem}>
        <Text style={styles.label}>{i.t('Short description')}</Text>
        {staffDetail.short_description ? (
          <HTML source={{ html: staffDetail.short_description }} contentWidth={width - 32} />
        ) : (
          <Text style={styles.value}>N/A</Text>
        )}
      </View>
      {renderDetailItem('Language', staffDetail.lang_code)}
      {renderDetailItem('Country', staffDetail.country)}
      {renderDetailItem('State', staffDetail.state)}
      {renderDetailItem('City', staffDetail.city)}
      {renderDetailItem('Zipcode', staffDetail.zipcode)}
      {renderDetailItem('Address', staffDetail.address)}
    </ScrollView>
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
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  detailItem: {
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});

export default StaffDetailScreen;