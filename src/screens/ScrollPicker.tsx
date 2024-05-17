import React, { useEffect } from 'react'
import { View, I18nManager } from 'react-native'
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  LogBox
} from 'react-native'
import theme from '../config/theme'

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state'
])

const styles = (isItemActive: boolean | null) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 10,
      height: '100%'
    },
    scrollContainer: {
      paddingHorizontal: I18nManager.isRTL
        ? theme.$containerPadding / 2
        : theme.$containerPadding,
      marginLeft: I18nManager.isRTL ? theme.$containerPadding : 0,
      backgroundColor: '#fff'
    },
    itemWrapper: {
      marginVertical: 5,
      textAlign: 'center',
      paddingVertical: 10,
      borderRadius: theme.$borderRadius,
      borderColor: theme.$mediumGrayColor,
      borderWidth: 1,
      backgroundColor: isItemActive ? theme.$buttonBackgroundColor : undefined
    },
    itemText: {
      fontSize: 16,
      textAlign: 'center',
      color: isItemActive ? '#fff' : theme.$darkColor
    }
  })

interface ScrollPickerProps {
  changePickerValueHandler: Function
  selectValue: string
  navigation: {}
  route: {
    params: {
      pickerValues: string[]
      changePickerValueHandler: Function
      selectValue: string
      additionalData: {
        [key: string]: any
      }
      title: string
      nextScreen: string
    }
  }
}

export const ScrollPicker: React.FC<ScrollPickerProps> = ({
  navigation,
  route
}) => {
  const {
    pickerValues,
    changePickerValueHandler,
    selectValue,
    additionalData,
    title,
    nextScreen
  } = route.params

  useEffect(() => {
    navigation.setOptions({
      title: title
    })
  }, [])

  const renderItem = (value: string, index: number) => {
    const isItemActive = value === selectValue

    return (
      <TouchableOpacity
        activeOpacity={isItemActive ? 1 : 0.2}
        style={styles(isItemActive).itemWrapper}
        onPress={
          !isItemActive
            ? () => {
                if (nextScreen) {
                  navigation.pop()
                  navigation.navigate(
                    nextScreen,
                    changePickerValueHandler(value, additionalData)
                  )
                } else {
                  changePickerValueHandler(value, additionalData)
                  navigation.pop()
                }
              }
            : undefined
        }
        key={index}>
        <Text style={styles(isItemActive).itemText}>{value}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles(null).container}>
      <ScrollView style={styles(null).scrollContainer}>
        {pickerValues.map((value, index) => {
          return renderItem(value, index)
        })}
      </ScrollView>
    </View>
  )
}

export default ScrollPicker
