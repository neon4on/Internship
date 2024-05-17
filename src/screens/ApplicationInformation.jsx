// ApplicationInformation.js
import React from 'react';
import { StyleSheet, View, Text, Image, ScrollView } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
});

const ApplicationInformation = () => {
  const appName = DeviceInfo.getApplicationName();
  const appVersion = DeviceInfo.getVersion();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Application Information</Text>
        <Image source={require('../assets/kit.jpeg')} style={styles.image} />
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>App Name:</Text>
          <Text style={styles.infoValue}>{appName}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoLabel}>App Version:</Text>
          <Text style={styles.infoValue}>{appVersion}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default ApplicationInformation;