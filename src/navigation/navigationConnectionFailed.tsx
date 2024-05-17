import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { ConnectionFailed } from '../screens/ConnectionFailed'

const Stack = createNativeStackNavigator()

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name=" " component={ConnectionFailed} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation
