import React, { Component } from 'react'
import { View, Modal, ActivityIndicator, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  indicator: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  }
})

class Spinner extends Component {
  static defaultProps = {
    mode: 'content',
    visible: false
  }

  renderAsModal = () => {
    const { visible } = this.props
    return (
      <Modal animationType="fade" transparent visible={visible}>
        <View style={styles.container}>
          <ActivityIndicator
            color="white"
            size="large"
            style={styles.indicator}
          />
        </View>
      </Modal>
    )
  }

  renderAsContent = () => {
    const { visible } = this.props

    if (!visible) {
      return null
    }

    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator
          size="large"
          style={styles.indicator}
          color="black"
        />
      </View>
    )
  }

  render() {
    const { mode } = this.props

    if (mode === 'content') {
      return this.renderAsContent()
    }

    return this.renderAsModal()
  }
}

export default Spinner
