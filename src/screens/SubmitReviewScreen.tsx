import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import AxiosInstance from '../services/api';
import i from '../utils/i18n_local';

const SubmitReviewScreen = ({ navigation, route }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name || !message) {
      Alert.alert(i.t('Error'), i.t('Please fill all fields'));
      return;
    }

    try {
      const response = await AxiosInstance.post('/sra_discussion_messages', {
        name,
        message,
      });

      Alert.alert(i.t('Success'), i.t('Your review has been submitted'), [{
        text: i.t('OK'),
        onPress: () => {
          if (route.params?.onReviewSubmitted) {
            route.params.onReviewSubmitted();
          }
          navigation.goBack();
        }
      }]);
    } catch (error) {
      console.error('Error:', error.message);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      Alert.alert(i.t('Error'), i.t('An error occurred while submitting your review'));
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