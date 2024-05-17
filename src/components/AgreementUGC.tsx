import React from 'react'
import { Text, TouchableOpacity, StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import { registerDrawerDeepLinks } from '../services/deepLinks'
import { Checkbox } from 'react-native-paper'

const styles = StyleSheet.create({
  userAgreementContainer: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 15,
    paddingRight: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  userAgreementTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  userAgreementText: {
    fontSize: 18,
    marginRight: 5,
    color: theme.$categoryBlockTextColor
  },
  userAgreementLink: {
    fontSize: 18,
    color: 'blue'
  },
  errorTextStyle: {
    color: theme.$dangerColor,
    fontSize: 16,
    marginLeft: 15
  }
})

export const AgreementUGC = ({
  agreementError,
  agreementUser,
  onPress,
  navigation
}) => {
  const settings = useSelector(state => state.settings)

  return (
    <>
      <View style={styles.userAgreementContainer}>
        <View style={styles.userAgreementTextContainer}>
          <Text style={styles.userAgreementText}>
            {i18n.t('I agree to the')}
          </Text>
          <TouchableOpacity
            onPress={() => {
              registerDrawerDeepLinks(
                {
                  link: settings.termsOfServiceUrl,
                  payload: {
                    title: i18n.t('terms of service').toUpperCase()
                  }
                },
                navigation
              )
            }}>
            <Text style={styles.userAgreementLink}>
              {i18n.t('terms of service')}
            </Text>
          </TouchableOpacity>
        </View>
        <Checkbox.Android
          status={agreementUser ? 'checked' : 'unchecked'}
          onPress={() => onPress()}
        />
      </View>
      {agreementError && (
        <Text style={styles.errorTextStyle}>
          {i18n.t('The {{field}} field is required', {
            field: i18n.t('terms of service'),
            interpolation: { escapeValue: false }
          })}
        </Text>
      )}
    </>
  )
}
