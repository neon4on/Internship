import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    paddingTop: 20
  },
  topDivider: {
    borderTopWidth: 1,
    borderColor: '#d9d9d9',
    width: '100%'
  },
  wrapper: {
    backgroundColor: '#fff'
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: 16,
    paddingBottom: 10,
    textAlign: 'left',
    fontWeight: '500',
    color: theme.$darkColor,
    width: '50%',
    marginRight: 10
  },
  rightButton: {
    width: '50%',
    paddingRight: 10
  },
  rightButtonText: {
    color: theme.$buttonWithoutBackgroundTextColor,
    fontSize: 16,
    textAlign: 'right'
  }
})

const Section = ({
  children,
  title = '',
  wrapperStyle,
  containerStyle,
  showRightButton,
  rightButtonText,
  onRightButtonPress,
  topDivider = false
}) => (
  <>
    {topDivider && <View style={styles.topDivider} />}
    <View style={[styles.container, containerStyle]}>
      <View style={styles.titleContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {showRightButton && (
          <TouchableOpacity
            onPress={() => onRightButtonPress()}
            style={styles.rightButton}>
            <Text style={styles.rightButtonText}>{rightButtonText}</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity>
        <View style={[styles.wrapper, wrapperStyle]}>{children}</View>
      </TouchableOpacity>
    </View>
  </>
)

export default Section
