import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet } from 'react-native'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 10
  },
  containerWarning: {
    width: '100%',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: theme.$dangerColor,
    padding: 5,
    borderRadius: theme.$borderRadius
  },
  optionTitleWrapper: {
    flexDirection: 'row',
    width: '45%'
  },
  title: {
    fontSize: 14,
    textAlign: 'left',
    color: theme.$dangerColor
  },
  commentText: {
    color: '#9cb0c4',
    marginTop: 3
  },
  input: {
    fontSize: 14,
    height: 60,
    borderColor: '#EEEEEE',
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 8,
    padding: 8
  },
  optionRequiredSign: {
    color: 'red'
  }
})

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  componentDidMount() {
    const { option } = this.props
    this.setState({ value: option.value })
  }

  handleChange(value) {
    this.setState({ value })
    this.props.onChange(value)
  }

  renderComment = option => {
    if (option.comment) {
      return <Text style={styles.commentText}>{option.comment}</Text>
    }
    return null
  }

  render() {
    const { option, style } = this.props
    const { value } = this.state
    const isOptionRequired = option.required === 'Y'
    const containerStyles = option.requiredOptionWarning
      ? styles.containerWarning
      : styles.container

    return (
      <View style={{ ...containerStyles, ...style }}>
        <View style={styles.optionTitleWrapper}>
          <Text style={styles.title}>{option.option_name}:</Text>
          {isOptionRequired && (
            <Text style={styles.optionRequiredSign}> *</Text>
          )}
        </View>
        <View style={styles.optionsVariants}>
          <TextInput
            multiline
            value={value}
            style={styles.input}
            autoCapitalize="none"
            keyboardAppearance="dark"
            clearButtonMode="while-editing"
            onChangeText={text => this.handleChange(text)}
          />
        </View>
        {this.renderComment(option)}
      </View>
    )
  }
}
