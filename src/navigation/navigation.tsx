import React from 'react'
import { Platform } from 'react-native'
import { useSelector } from 'react-redux'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import i18n from '../utils/i18n'
import config from '../config'
import theme from '../config/theme'
import { HomeScreen } from '../screens/HomeScreen'
import ProfileScreen from '../screens/ProfileScreen'
import SearchScreen from '../screens/SearchScreen'
import { CartScreen } from '../screens/CartScreen'
import { WishListScreen } from '../screens/WishListScreen'
import Icon from 'react-native-vector-icons/Ionicons'
import ProductDetail from '../screens/ProductDetail'
import Categories from '../screens/Categories'
import VendorDetail from '../screens/VendorDetail'
import WriteReview from '../screens/WriteReview'
import WriteReviewNew from '../screens/WriteReviewNew'
import WriteReport from '../screens/WriteReport'
import Discussion from '../screens/Discussion'
import Vendor from '../screens/Vendor'
import { Login } from '../screens/Login'
import { CheckoutComplete } from '../screens/CheckoutComplete'
import CheckoutPayment from '../screens/CheckoutPayment'
import CheckoutProfile from '../screens/CheckoutProfile'
import CheckoutShipping from '../screens/CheckoutShipping'
import VendorManageOrders from '../screens/VendorManage/Orders'
import VendorManageProducts from '../screens/VendorManage/Products'
import VendorManageCategoriesPicker from '../screens/VendorManage/CategoriesPicker'
import LanguageSelection from '../screens/LanguageSelection'
import CurrencySelection from '../screens/CurrencySelection'
import Registration from '../screens/Registration'
import ProfileEdit from '../screens/ProfileEdit'
import Page from '../screens/Page'
import Orders from '../screens/Orders'
import Gallery from '../screens/Gallery'
import OrderDetail from '../screens/OrderDetail'
import ScrollPicker from '../screens/ScrollPicker'
import MultipleCheckboxPicker from '../screens/MultipleCheckboxPicker'
import CheckoutAuth from '../screens/CheckoutAuth'
import ResetPassword from '../screens/ResetPassword'
import SettlementsCompleteWebView from '../screens/SettlementsCompleteWebView'
import VendorManageAddProductStep1 from '../screens/VendorManage/AddProductStep1'
import VendorManageAddProductStep2 from '../screens/VendorManage/AddProductStep2'
import VendorManageAddProductStep3 from '../screens/VendorManage/AddProductStep3'
import VendorManageEditProduct from '../screens/VendorManage/EditProduct'
import VendorManagePricingInventory from '../screens/VendorManage/PricingInventory'
import VendorManageFeatures from '../screens/VendorManage/Features'
import VendorManageShippingProperties from '../screens/VendorManage/ShippingProperties'
import VendorManageOrderDetail from '../screens/VendorManage/OrderDetail'
import SocialLogin from '../screens/SocialLogin'
import AllProductReviews from '../screens/AllProductReviews'
import DatePickerScreen from '../screens/DatePickerScreen'
import { StripePaymentProvider } from '../screens/StripePaymentProvider'
import { isDarkBackground } from '../utils'

Icon.loadFont()
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()
const iosStatusBarStyle = isDarkBackground(theme.$navBarBackgroundColor)
  ? 'light'
  : 'dark'

const commonScreenOptions = {
  headerBackTitleVisible: false,
  headerShown: true,
  headerStyle: {
    backgroundColor: theme.$navBarBackgroundColor
  },
  headerTitleStyle: {
    color: theme.$navBarTextColor,
    fontSize: theme.$navBarTitleFontSize
  },
  headerTitleAlign: 'center',
  statusBarStyle: Platform.OS === 'ios' ? iosStatusBarStyle : 'auto',
  statusBarColor: theme.$statusBarColor,
  headerTintColor: theme.$navBarButtonColor
}

const HomeSection = () => {
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name={'HomeScreen'}
        component={HomeScreen}
        options={{
          title: config.shopName.toUpperCase()
        }}
      />
      <Stack.Screen
        name={'ProductDetail'}
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={'Categories'}
        component={Categories}
        options={{ title: i18n.t('Categories') }}
      />
      <Stack.Screen name={'Vendor'} component={Vendor} />
      <Stack.Screen
        name={'CheckoutPayment'}
        component={CheckoutPayment}
        options={{ title: i18n.t('Payment method') }}
      />
      <Stack.Screen
        name={'CheckoutProfile'}
        component={CheckoutProfile}
        options={{ title: i18n.t('Profile') }}
      />
      <Stack.Screen
        name={'CheckoutShipping'}
        component={CheckoutShipping}
        options={{ title: i18n.t('Shipping') }}
      />
    </Stack.Navigator>
  )
}

const SearchSection = () => {
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name={'SearchScreen'}
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={'ProductDetail'}
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={'Categories'} component={Categories} />

      <Stack.Screen name={'Vendor'} component={Vendor} />
      <Stack.Screen
        name={'CheckoutPayment'}
        component={CheckoutPayment}
        options={{ title: i18n.t('Payment method') }}
      />
      <Stack.Screen
        name={'CheckoutProfile'}
        component={CheckoutProfile}
        options={{ title: i18n.t('Profile') }}
      />
      <Stack.Screen
        name={'CheckoutShipping'}
        component={CheckoutShipping}
        options={{ title: i18n.t('Shipping') }}
      />
    </Stack.Navigator>
  )
}

const CartSection = () => {
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name={'CartScreen'}
        component={CartScreen}
        options={{ title: i18n.t('Cart').toUpperCase() }}
      />
      <Stack.Screen
        name={'ProductDetail'}
        component={ProductDetail}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={'Categories'} component={Categories} />

      <Stack.Screen name={'Vendor'} component={Vendor} />
      <Stack.Screen
        name={'CheckoutComplete'}
        component={CheckoutComplete}
        options={{ title: i18n.t('Checkout complete').toUpperCase() }}
      />
      <Stack.Screen
        name={'CheckoutPayment'}
        component={CheckoutPayment}
        options={{ title: i18n.t('Payment method') }}
      />
      <Stack.Screen
        name={'CheckoutProfile'}
        component={CheckoutProfile}
        options={{ title: i18n.t('Profile') }}
      />
      <Stack.Screen
        name={'CheckoutShipping'}
        component={CheckoutShipping}
        options={{ title: i18n.t('Shipping') }}
      />
      <Stack.Screen
        name={'StripePaymentProvider'}
        component={StripePaymentProvider}
      />
      <Stack.Screen
        name={'SettlementsCompleteWebView'}
        component={SettlementsCompleteWebView}
      />
    </Stack.Navigator>
  )
}

const WishListSection = () => {
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name={'WishListScreen'}
        component={WishListScreen}
        options={{ title: i18n.t('Wish List').toUpperCase() }}
      />
      <Stack.Screen
        name={'ProductDetail'}
        component={ProductDetail}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const ProfileSection = () => {
  return (
    <Stack.Navigator screenOptions={commonScreenOptions}>
      <Stack.Screen
        name={'ProfileScreen'}
        component={ProfileScreen}
        options={{ title: i18n.t('Profile').toUpperCase() }}
      />
      <Stack.Screen
        name={'VendorManageOrders'}
        component={VendorManageOrders}
        options={{ title: i18n.t('Vendor Orders').toUpperCase() }}
      />
      <Stack.Screen
        name={'VendorManageProducts'}
        component={VendorManageProducts}
        options={{ title: i18n.t('Vendor products').toUpperCase() }}
      />
      <Stack.Screen
        name={'VendorManageCategoriesPicker'}
        component={VendorManageCategoriesPicker}
        options={{ title: i18n.t('Categories') }}
      />
      <Stack.Screen
        name={'LanguageSelection'}
        component={LanguageSelection}
        options={{ title: i18n.t('Select Language') }}
      />
      <Stack.Screen
        name={'CurrencySelection'}
        component={CurrencySelection}
        options={{ title: i18n.t('Currency') }}
      />
      <Stack.Screen
        name={'ProfileEdit'}
        component={ProfileEdit}
        options={{ title: i18n.t('Profile') }}
      />
      <Stack.Screen
        name={'Orders'}
        component={Orders}
        options={{ title: i18n.t('Orders') }}
      />
      <Stack.Screen
        name={'OrderDetail'}
        component={OrderDetail}
        options={{ title: i18n.t('Order Detail').toUpperCase() }}
      />
      <Stack.Screen
        name={'VendorManageOrderDetail'}
        component={VendorManageOrderDetail}
        options={{ title: i18n.t('Order Detail').toUpperCase() }}
      />
      <Stack.Screen
        name={'VendorManageEditProduct'}
        component={VendorManageEditProduct}
        options={{ title: i18n.t('Edit product') }}
      />
      <Stack.Screen
        name={'VendorManagePricingInventory'}
        component={VendorManagePricingInventory}
        options={{ title: i18n.t('Pricing / Inventory') }}
      />
      <Stack.Screen
        name={'VendorManageShippingProperties'}
        component={VendorManageShippingProperties}
        options={{ title: i18n.t('Shipping properties') }}
      />
      <Stack.Screen
        name={'VendorManageFeatures'}
        component={VendorManageFeatures}
        options={{ title: i18n.t('Features') }}
      />
      <Stack.Screen
        name={'VendorManageAddProductStep1'}
        component={VendorManageAddProductStep1}
        options={{ title: i18n.t('') }}
      />
      <Stack.Screen
        name={'VendorManageAddProductStep2'}
        component={VendorManageAddProductStep2}
        options={{ title: i18n.t('') }}
      />
      <Stack.Screen
        name={'VendorManageAddProductStep3'}
        component={VendorManageAddProductStep3}
        options={{ title: i18n.t('') }}
      />
    </Stack.Navigator>
  )
}

const MyTabs = () => {
  const wishList = useSelector(state => state.wishList)
  const wishListItemsAmount = wishList.items.length
  const cart = useSelector(state => state.cart)

  const initialAmountOfCartItems = 0
  let cartItemsAmount = Object.keys(cart.carts).reduce(
    (previousValue, currentValue) =>
      cart.carts[currentValue].amount + previousValue,
    initialAmountOfCartItems
  )

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.$bottomTabsBackgroundColor
        },
        tabBarInactiveTintColor: theme.$bottomTabsTextColor,
        tabBarActiveTintColor: theme.$bottomTabsSelectedTextColor,
        tabBarBadgeStyle: {
          backgroundColor: theme.$bottomTabsPrimaryBadgeColor,
          color: '#fff'
        },
        tabBarHideOnKeyboard: true
      }}>
      <Tab.Screen
        name={i18n.t('Home')}
        component={HomeSection}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? theme.$bottomTabsSelectedIconColor
              : theme.$bottomTabsIconColor

            return <Icon name={'home-outline'} size={25} color={iconColor} />
          }
        }}
      />
      <Tab.Screen
        name={i18n.t('Search')}
        component={SearchSection}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? theme.$bottomTabsSelectedIconColor
              : theme.$bottomTabsIconColor

            return <Icon name={'search-outline'} size={25} color={iconColor} />
          }
        }}
      />
      <Tab.Screen
        name={i18n.t('Cart')}
        component={CartSection}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color }) => {
            const iconColor = focused
              ? theme.$bottomTabsSelectedIconColor
              : theme.$bottomTabsIconColor

            return <Icon name={'cart-outline'} size={25} color={iconColor} />
          },
          tabBarBadge: cartItemsAmount ? cartItemsAmount : null
        }}
      />
      <Tab.Screen
        name={i18n.t('Wish List')}
        component={WishListSection}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? theme.$bottomTabsSelectedIconColor
              : theme.$bottomTabsIconColor

            return <Icon name={'heart-outline'} size={25} color={iconColor} />
          },
          tabBarBadge: wishListItemsAmount ? wishListItemsAmount : null
        }}
      />
      <Tab.Screen
        name={i18n.t('Profile')}
        component={ProfileSection}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            const iconColor = focused
              ? theme.$bottomTabsSelectedIconColor
              : theme.$bottomTabsIconColor

            return <Icon name={'person-outline'} size={25} color={iconColor} />
          }
        }}
      />
    </Tab.Navigator>
  )
}

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={commonScreenOptions}>
        <Stack.Screen
          name={'HomeBase'}
          options={{ headerShown: false }}
          component={MyTabs}
        />
        <Stack.Screen
          name={'Login'}
          component={Login}
          options={{ title: i18n.t('Login').toUpperCase() }}
        />
        <Stack.Screen
          name={'SocialLogin'}
          component={SocialLogin}
          options={{ title: i18n.t('') }}
        />
        <Stack.Screen
          name={'VendorDetail'}
          component={VendorDetail}
          options={{ title: i18n.t('Vendor Detail').toUpperCase() }}
        />
        <Stack.Screen
          name={'WriteReview'}
          component={WriteReview}
          options={{ title: i18n.t('Write a Review').toUpperCase() }}
        />
        <Stack.Screen
          name={'WriteReport'}
          component={WriteReport}
          options={{ title: i18n.t('Write a Report').toUpperCase() }}
        />
        <Stack.Screen
          name={'WriteReviewNew'}
          component={WriteReviewNew}
          options={{ title: i18n.t('Write a Review').toUpperCase() }}
        />
        <Stack.Screen
          name={'Discussion'}
          component={Discussion}
          options={{ title: i18n.t('Comments & Reviews').toUpperCase() }}
        />
        <Stack.Screen
          name={'AllProductReviews'}
          component={AllProductReviews}
          options={{ title: i18n.t('All reviews').toUpperCase() }}
        />
        <Stack.Screen
          name={'Registration'}
          component={Registration}
          options={{ title: i18n.t('Registration') }}
        />
        <Stack.Screen
          name={'ScrollPicker'}
          component={ScrollPicker}
          options={{ title: i18n.t('') }}
        />
        <Stack.Screen
          name={'Gallery'}
          component={Gallery}
          options={{ title: i18n.t('') }}
        />
        <Stack.Screen
          name={'ResetPassword'}
          component={ResetPassword}
          options={{ title: i18n.t('Reset password') }}
        />
        <Stack.Screen
          name={'Page'}
          component={Page}
          options={{ title: i18n.t('') }}
        />
        <Stack.Screen
          name={'MultipleCheckboxPicker'}
          component={MultipleCheckboxPicker}
          options={{ title: i18n.t('') }}
        />
        <Stack.Screen
          name={'DatePickerScreen'}
          component={DatePickerScreen}
          options={{ title: i18n.t('') }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigation
