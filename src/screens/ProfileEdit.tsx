import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import { isDate, format } from 'date-fns'

// Import actions.
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

export class ProfileEdit extends Component {
  constructor(props) {
    super(props)

    this.state = {
      fetching: true,
      profile: {},
      forms: []
    }
  }

  componentDidMount() {
    const { authActions } = this.props

    authActions.fetchProfile().then(profile => {
      this.setState({
        profile,
        fetching: false,
        forms: profile.fields
      })
    })
  }

  handleSave = values => {
    const { profile } = this.state
    const { authActions, componentId, settings } = this.props
    if (values) {
      const data = { ...values }
      Object.keys(data).forEach(key => {
        if (isDate(data[key])) {
          data[key] = format(data[key], settings.dateFormat)
        }
      })

      authActions.updateProfile(profile.user_id, data, componentId)
    }
  }

  render() {
    const { fetching, forms } = this.state
    const { settings, auth, navigation } = this.props

    if (fetching) {
      return (
        <View style={styles.container}>
          <Spinner visible />
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <ProfileForm
          isLogged={auth.logged}
          fields={forms}
          isEdit
          onSubmit={values => this.handleSave(values)}
          dateFormat={settings.dateFormat}
          componentId={this.props.componentId}
          navigation={navigation}
        />
      </View>
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
)(ProfileEdit)
