import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Alert  } from 'react-native'

// Components
import Button from './Button'

// Utils
import i18n from '../utils/i18n'
import { formatPrice } from '../utils'

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#F1F1F1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14
  },
  cartInfoTitle: {
    color: '#979797'
  },
  cartInfoTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FD542A'
  }
})

export default class extends PureComponent {
  handleAddToCart = () => {
    const { onBtnPress, product } = this.props;

    // Проверяем, что все необходимые опции выбраны
    const hasRequiredOptions = product.options.every(option => {
      if (option.required) {
        const selectedOption = product.selectedOptions[option.selectDefaultId];
        return selectedOption !== undefined;
      }
      return true;
    });

    if (hasRequiredOptions) {
      // Если все необходимые опции выбраны, добавляем товар в корзину
      onBtnPress();
    } else {
      // Если не все необходимые опции выбраны, показываем сообщение об ошибке
      Alert.alert(
        'Выберите обязательные параметры',
        'Пожалуйста, выберите все обязательные параметры перед добавлением товара в корзину.',
        [{ text: 'OK' }]
      );
    }
  };

  render() {
    const { totalPrice, isBtnDisabled, btnText } = this.props;

    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.cartInfoTitle}>{i18n.t('Total').toUpperCase()}</Text>
          <Text style={styles.cartInfoTotal}>{formatPrice(totalPrice)}</Text>
        </View>
        <Button
          type={isBtnDisabled ? 'disabledPrimary' : 'primary'}
          onPress={this.handleAddToCart}
          disabled={isBtnDisabled}
        >
          <Text style={styles.placeOrderBtnText}>{btnText}</Text>
        </Button>
      </View>
    );
  }
}