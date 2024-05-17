import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native'
import { ShopClosed } from '../screens/ShopClosed'

const Stack = createNativeStackNavigator()

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: true }}>
        <Stack.Screen name="ShopClosed" component={ShopClosed} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation
