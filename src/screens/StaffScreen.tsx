import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { fetchStaff } from '../redux/actions/staffActions';
import config from '../config';
import i from '../utils/i18n_local'

const StaffItem = React.memo(({ item, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.id)}>
      <View style={styles.staffItem}>
        {item.image_path && (
          <Image 
            source={{ uri: item.image_path }} 
            style={styles.staffImage}
            resizeMode="cover"
          />
        )}
        <View style={styles.staffInfo}>
          <Text style={styles.staffName}>{item.name}</Text>
          <Text style={styles.staffJobTitle}>{item.job_title}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const StaffScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { list: staffList, loading, error } = useSelector((state) => {
    console.log('Current Redux State:', state.staff);
    return state.staff;
  });

  useEffect(() => {
    console.log('Dispatching fetchStaff');
    dispatch(fetchStaff());
  }, [dispatch]);

  useEffect(() => {
    console.log('StaffList updated:', staffList);
  }, [staffList]);

  const renderItem = useCallback(({ item }) => {
    console.log('Rendering item:', item);
    return <StaffItem item={item} onPress={handlePress} />;
  }, [handlePress]);

  const handlePress = useCallback((id) => {
    navigation.navigate('StaffDetailScreen', { staffId: id });
  }, [navigation]);

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

  console.log('StaffList:', staffList);

  return (
    <View style={styles.container}>
      <Button title={i.t('Add Staff')} onPress={() => navigation.navigate('StaffAddEditScreen')} />
      <FlatList
        data={staffList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
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
    flexDirection: 'row',
    alignItems: 'center',
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
  staffImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  staffInfo: {
    flex: 1,
  },
  staffName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  staffJobTitle: {
    fontSize: 14,
    color: '#333',
  },
});

export default StaffScreen;
