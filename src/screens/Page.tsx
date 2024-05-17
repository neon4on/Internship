import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, StyleSheet } from 'react-native'
import theme from '../config/theme'

// Components
import { WebViewer } from '../components/WebViewer'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  }
})

export class Page extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { route } = this.props
    const { uri } = route.params

    return (
      <View style={styles.container}>
        <WebViewer uri={uri} />
      </View>
    )
  }
}

export default connect(state => ({
  auth: state.auth
}))(Page)
