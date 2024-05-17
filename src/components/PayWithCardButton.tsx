import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  GestureResponderEvent
} from 'react-native'
import theme from '../config/theme'

interface PayWithCardButtonProps {
  pressHandler: (event: GestureResponderEvent) => void
}

export const PayWithCardButton: React.FC<PayWithCardButtonProps> = ({
  pressHandler
}) => {
  return (
    <TouchableOpacity style={styles.cardButtonContainer} onPress={pressHandler}>
      <Text style={styles.cardButtonText}>Pay with a card</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardButtonContainer: {
    backgroundColor: theme.$buttonBackgroundColor,
    padding: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardButtonText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 16
  }
})
