import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import DeviceInfo from 'react-native-device-info';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
});

const ApplicationInformation = () => {
  const appName = DeviceInfo.getApplicationName();
  const appVersion = DeviceInfo.getVersion();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Information</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>App Name:</Text>
        <Text style={styles.infoValue}>{appName}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.infoLabel}>App Version:</Text>
        <Text style={styles.infoValue}>{appVersion}</Text>
      </View>
    </View>
  );
};

export default ApplicationInformation;