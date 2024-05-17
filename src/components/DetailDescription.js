import React from 'react'
import RenderHtml from 'react-native-render-html'
import { MAX_WINDOW_WIDTH } from '../utils'
import { View, StyleSheet } from 'react-native'
import theme from '../config/theme'

const styles = StyleSheet.create({
  container: {
    textAlign: 'left',
    color: theme.$darkColor
  }
})

// Added React.memo
// more info here: https://stackoverflow.com/questions/68966120/react-native-render-html-you-seem-to-update-the-x-prop-of-the-y-component-in-s
const DetailDescription = React.memo(function DetailDescription({
  description,
  id,
  title,
  navigation
}) {
  const horizontalPadding = 40
  const descriptionWidth = MAX_WINDOW_WIDTH - horizontalPadding
  const fullDescription = {
    html: description
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
    <View>
      <RenderHtml
        contentWidth={descriptionWidth}
        source={fullDescription}
        renderersProps={renderersProps}
        baseStyle={styles.container}
      />
    </View>
  )
})

export default DetailDescription
