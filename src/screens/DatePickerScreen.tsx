import React, { useState } from 'react'
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'
import DatePicker from 'react-native-date-picker'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 10
  },
  button: {
    width: '30%',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: theme.$borderRadius,
    backgroundColor: theme.$buttonBackgroundColor
  },
  buttonText: {
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 14
  }
})

interface FeatureVariant {
  variant: string
  variant_id: number
  selected: boolean
}

interface Feature {
  description: string
  feature_id: number
  feature_type: string
  value: string
  variant: string
  variant_id: number
  value_int: number
  variants: [FeatureVariant]
}

interface DatePickerScreenProps {
  route: {
    params: {
      feature: Feature
      changeDateHandler: Function
    }
  }
}

export const DatePickerScreen: React.FC<DatePickerScreenProps> = ({
  navigation,
  route
}) => {
  const { feature, changeDateHandler } = route.params
  const [date, setDate] = useState(new Date(feature.value_int * 1000))

  return (
    <View style={styles.container}>
      <DatePicker date={date} onDateChange={setDate} mode={'date'} />
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          changeDateHandler(feature, date)
          navigation.pop()
        }}>
        <Text style={styles.buttonText}>Ok</Text>
      </TouchableOpacity>
    </View>
  )
}

export default DatePickerScreen
