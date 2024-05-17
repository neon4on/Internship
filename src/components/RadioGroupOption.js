import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import theme from '../config/theme'
import { OPTION_IS_REQUIRED } from '../constants/index'
import { v4 as uuidv4 } from 'uuid'

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
  titleAndTitleSubWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 14,
    textAlign: 'left'
  },
  titleSub: {
    fontSize: 14,
    marginRight: 10,
    width: '45%'
  },
  commentText: {
    color: '#9cb0c4',
    marginTop: 3,
    textAlign: 'left'
  },
  optionsVariants: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginTop: 15
  },
  optionsItem: {
    padding: 8,
    borderWidth: 1,
    borderColor: theme.$mediumGrayColor,
    borderRadius: 5,
    marginBottom: 6,
    marginRight: 6
  },
  optionsItemBtnText: {
    color: theme.$mediumGrayColor,
    fontSize: 13
  },
  optionsItemBtnTextActive: {
    color: '#ff5319'
  },
  optionsItemActive: {
    borderColor: '#ff5319'
  },
  optionRequiredSign: {
    color: 'red'
  }
})

export default class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: null
    }
  }

  componentDidMount() {
    const { value } = this.props
    this.setState({ value })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    this.setState({ value })
  }

  handleChange(value) {
    this.props.onChange(value)
  }

  renderComment = option => {
    if (option.comment) {
      return <Text style={styles.commentText}>{option.comment}</Text>
    }
    return null
  }

  render() {
    const { option } = this.props
    const { value } = this.state
    const isOptionRequired = option.required === 'Y'

    if (!value || !option) {
      return null
    }

    const optionsVariantsList = option.selectVariants.map(v => {
      const active = value.variant_id === v.variant_id
      let content = (
        <Text
          style={[
            styles.optionsItemBtnText,
            active && styles.optionsItemBtnTextActive
          ]}>
          {v.variant_name}
        </Text>
      )

      if (v.selectVariantName === OPTION_IS_REQUIRED) {
        return
      }

      return (
        <TouchableOpacity
          key={uuidv4()}
          style={[styles.optionsItem, active && styles.optionsItemActive]}
          onPress={() => this.handleChange(v)}>
          {content}
        </TouchableOpacity>
      )
    })

    return (
      <View
        style={
          option.requiredOptionWarning
            ? styles.containerWarning
            : styles.container
        }>
        <View style={styles.titleAndTitleSubWrapper}>
          <View style={styles.optionTitleWrapper}>
            <Text style={styles.title}>{option.option_name}</Text>
            {isOptionRequired && (
              <Text style={styles.optionRequiredSign}> *</Text>
            )}
          </View>
          <Text style={styles.titleSub}>{value.variant_name}</Text>
        </View>
        <View style={styles.optionsVariants}>{optionsVariantsList}</View>
        {this.renderComment(option)}
      </View>
    )
  }
}
