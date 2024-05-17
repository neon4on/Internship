import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { omit } from 'lodash'
import RNRestart from 'react-native-restart'
import { ScrollView, StyleSheet } from 'react-native'

// Actions
import * as settingsActions from '../redux/actions/settingsActions'

// Components
import { RadioButtonItem } from '../components/RadioButtonItem'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export const CurrencySelection = ({ settingsActions, settings }) => {
  const changeLanguageHandler = currency => {
    const omitCurrency = omit(currency, ['selected'])
    settingsActions.setCurrency(omitCurrency)
    RNRestart.Restart()
  }

  if (settings.currencies) {
    return (
      <ScrollView style={styles.container}>
        {settings.currencies.map((el, index) => (
          <RadioButtonItem
            key={index}
            item={el}
            onPress={!el.selected && changeLanguageHandler}
            title={el.currencyCode}
          />
        ))}
      </ScrollView>
    )
  }
  return null
}

export default connect(
  state => ({
    settings: state.settings
  }),
  dispatch => ({
    settingsActions: bindActionCreators(settingsActions, dispatch)
  })
)(CurrencySelection)
