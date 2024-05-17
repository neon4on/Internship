import React, { Component } from 'react'
import {
  View,
  Text,
  TextInput,
  Platform,
  TouchableOpacity,
  I18nManager,
  StyleSheet
} from 'react-native'
import theme from '../config/theme'

// Components
import Icon from './Icon'
import FormBlock from './FormBlock'
import i18n from '../utils/i18n'

const styles = StyleSheet.create({
  itemContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#EBEBEB'
  },
  itemText: {
    paddingTop: 4,
    fontSize: 16
  },
  itemBtn: {
    width: 30,
    height: 30
  },
  input: {
    color: '#000000',
    fontSize: 17,
    height: 36,
    paddingVertical: Platform.OS === 'ios' ? 7 : 0,
    paddingHorizontal: 7,
    borderRadius: 4,
    borderColor: '#cccccc',
    borderWidth: 1,
    marginBottom: 5,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr'
  },
  inputWrapper: {
    position: 'relative'
  },
  inputBtn: {
    backgroundColor: theme.$darkColor,
    borderRadius: 4,
    paddingHorizontal: 20,
    paddingVertical: 7,
    height: 36,
    position: 'absolute',
    top: 0,
    right: 0
  },
  inputBtnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  removeBtn: {
    padding: 2
  }
})

class CouponCodeSection extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: ''
    }
  }

  handleAddCoupon = () => {
    const { value } = this.state
    const { onAddPress } = this.props

    if (value && value !== '') {
      this.setState({
        value: ''
      })
      onAddPress(value)
    }
  }

  renderCouponItem = (item, index) => {
    const { onRemovePress } = this.props
    return (
      <View style={styles.itemContainer} key={index}>
        <Text style={styles.itemText}>{item}</Text>
        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemovePress(item)}>
          <Icon name="clear" style={styles.removeBtnIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    const { items } = this.props
    const { value } = this.state

    return (
      <View>
        <FormBlock title={i18n.t('Coupon code')}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              onChangeText={text => this.setState({ value: text })}
              value={value}
            />
            <TouchableOpacity
              onPress={this.handleAddCoupon}
              style={styles.inputBtn}>
              <Text style={styles.inputBtnText}>{i18n.t('Add')}</Text>
            </TouchableOpacity>
          </View>
          {items.map((item, index) => this.renderCouponItem(item, index))}
        </FormBlock>
      </View>
    )
  }
}

export default CouponCodeSection
