/**
 * @format
 */

import {AppRegistry, LogBox} from 'react-native'
import App from './App'
import {name as appName} from './app.json'
// Needs for using uuid or other libraries that assume crypto.getRandomValues is available.
import 'react-native-get-random-values'

// react-native-snap-carousel library has deprecated code
// It causes a warning 'ViewPropTypes will be removed from React Native.
// Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'
// By this code we disable this warning.
LogBox.ignoreLogs(['ViewPropTypes will be removed'])

AppRegistry.registerComponent(appName, () => App)
