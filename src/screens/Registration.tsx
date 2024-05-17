import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, SafeAreaView, StyleSheet } from 'react-native'

// Utils
import { format } from 'date-fns'
import identity from 'lodash/identity'
import pickBy from 'lodash/pickBy'
import trim from 'lodash/trim'
import { isDate } from 'date-fns'

// Actions
import * as authActions from '../redux/actions/authActions'

// Components
import Spinner from '../components/Spinner'
import ProfileForm from '../components/ProfileForm'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})

export class Registration extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      forms: []
    }
  }

  componentDidMount() {
    const { authActions } = this.props

    authActions.profileFields().then(fields => {
      this.setState({
        fetching: false,
        forms: fields
      })
    })
  }

  handleRegister = async values => {
    const { authActions, settings, navigation } = this.props

    if (values) {
      let data = { ...values }

      Object.keys(data).forEach(key => {
        if (isDate(data[key])) {
          data[key] = format(data[key], settings.dateFormat)
        }
        data[key] = trim(data[key])
      })

      // Remove all null and undefined values.
      data = pickBy(data, identity)

      await authActions.createProfile(data)
      navigation.pop()
    }
  }

  render() {
    const { fetching, forms } = this.state
    const { settings, auth, navigation } = this.props

    if (fetching || auth.fetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      )
    }

    return (
      <SafeAreaView style={styles.container}>
        <ProfileForm
          showTitles={true}
          fields={forms}
          isLogged={auth.logged}
          dateFormat={settings.dateFormat}
          onSubmit={values => this.handleRegister(values)}
          navigation={navigation}
        />
      </SafeAreaView>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth,
    settings: state.settings
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch)
  })
)(Registration)
