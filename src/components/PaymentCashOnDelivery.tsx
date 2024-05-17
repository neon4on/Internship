import React from 'react'
import { View, StyleSheet } from 'react-native'
import RenderHtml from 'react-native-render-html'
import { MAX_WINDOW_WIDTH } from '../utils'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    color: theme.$darkColor
  }
})

export const PaymentCashOnDelivery = ({ instruction, navigation }) => {
  const horizontalPadding = 40
  const width = MAX_WINDOW_WIDTH - horizontalPadding
  const fullInstruction = {
    html: instruction
  }
  const renderersProps = {
    a: {
      onPress: (event, href) => navigation.push('Page', { uri: href }),
      enableExperimentalRtl: true
    },
    p: {
      enableExperimentalRtl: true
    }
  }

  return (
    <View style={styles.container}>
      <RenderHtml
        contentWidth={width}
        source={fullInstruction}
        renderersProps={renderersProps}
        baseStyle={styles.container}
      />
    </View>
  )
}
