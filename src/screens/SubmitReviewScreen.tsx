import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AxiosInstance from '../services/api';
import { useDispatch } from 'react-redux';
import { fetchReviews } from '../redux/actions/reviewsActions';
import i from '../utils/i18n_local'

const SubmitReviewScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!name || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await AxiosInstance.post('/sra_discussion_messages', {
        name,
        message,
      });

      console.log('Response:', response);

      if (response.status === 201) {
        Alert.alert('Success', 'Your review has been submitted');
        dispatch(fetchReviews());
        navigation.goBack();
      } else {
        Alert.alert('Error', 'Failed to submit review');
      }
    } catch (error) {
      console.log('Error:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        console.log('Response status:', error.response.status);
        console.log('Response headers:', error.response.headers);
      }
      Alert.alert('Error', 'An error occurred while submitting your review');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i.t('Review')}</Text>
      <TextInput
        style={styles.input}
        placeholder={i.t('Your Name')}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder={i.t('Your Review')}
        value={message}
        onChangeText={setMessage}
        multiline
      />
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{i.t('Submit')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
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
  submitButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SubmitReviewScreen;
