import React, { useEffect } from 'react';
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
    navigation.navigate('StaffAddEditScreen', { staffId });
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

  if (!staffDetail) {
    return (
      <View style={styles.container}>
        <Text>No staff details available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Button title="Edit" onPress={handleEdit} style={styles.editButton} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      {staffDetail.image_path ? (
          <Image source={{ uri: staffDetail.image_path }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text>No Image Available</Text>
          </View>
        )}
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{staffDetail.name}</Text>

        <Text style={styles.label}>Job Title:</Text>
        <Text style={styles.value}>{staffDetail.job_title}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{staffDetail.email}</Text>

        <Text style={styles.label}>Position:</Text>
        <Text style={styles.value}>{staffDetail.position}</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>{staffDetail.status}</Text>

        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{staffDetail.gender}</Text>

        <Text style={styles.label}>Short description:</Text>
        <Text style={styles.value}>{staffDetail.short_description}</Text>

        <Text style={styles.label}>lang_code:</Text>
        <Text style={styles.value}>{staffDetail.lang_code}</Text>

        <Text style={styles.label}>country:</Text>
        <Text style={styles.value}>{staffDetail.country}</Text>

        <Text style={styles.label}>state:</Text>
        <Text style={styles.value}>{staffDetail.state}</Text>

        <Text style={styles.label}>city:</Text>
        <Text style={styles.value}>{staffDetail.city}</Text>

        <Text style={styles.label}>zipcode:</Text>
        <Text style={styles.value}>{staffDetail.zipcode}</Text>

        <Text style={styles.label}>address:</Text>
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
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  placeholder: {
    width: '100%',
    height: 200,
    marginBottom: 16,
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
  editButton: {
    marginBottom: 16,
  },
});

export default StaffDetailScreen;
