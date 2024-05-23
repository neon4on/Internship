import React, { Component, useState } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import { registerDrawerDeepLinks } from '../services/deepLinks'
import { USER_TYPE_VENDOR } from '../constants/index'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  I18nManager,
  Switch,
  StatusBar,
  SafeAreaView
} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CheckBox from '@react-native-community/checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Actions
import * as pagesActions from '../redux/actions/pagesActions'
import * as authActions from '../redux/actions/authActions'
import * as settingsActions from '../redux/actions/settingsActions'
import { setStartSettings } from '../redux/actions/appActions'

// Components
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'


const Stack = createNativeStackNavigator();

const lightTheme = {
  container: {
    backgroundColor: '#fff',
  },
  text: {
    color: '#000',
  },
  safeArea: {
    backgroundColor: '#fff',
  },
};

const darkTheme = {
  text: {
    color: '#fff',
  },
  sectionContainer: {
    backgroundColor: '#333',
    borderColor: '#444',
  },
  blockContainer: {
    backgroundColor: '#404040',
    borderColor: '#444',
  },
  sectionText: {
    color: '#ccc',
  },
  buttonContainer: {
    borderColor: '#444',
  },
  buttonText: {
    color: '#fff',
  },
  iconColor: {
    color: '#ccc',
  },
  safeArea: {
    backgroundColor: '#000',
  },
  container: {
    backgroundColor: '#000',
  },
};
const styles = StyleSheet.create({
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  toggleButtonText: {
    fontSize: 16,
  },
  toggleButtonActive: {
    backgroundColor: 'gray',
  },
  toggleButtonTextActive: {
    color: 'white',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  logo: {
    resizeMode: 'contain',
    width: '100%',
    height: 130
  },
  signInSectionContainer: {
    backgroundColor: theme.$grayColor,
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#e3e3e3',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signInSectionText: {
    color: '#9c9c9c',
    fontWeight: 'bold',
    fontSize: 13
  },
  signInBtnContainer: {
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: theme.$menuItemsBorderColor,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  signInButtons: {
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  signInBtnText: {
    color: theme.$menuTextColor
  },
  btn: {
    borderRadius: theme.$borderRadius,
    height: 38,
    marginBottom: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: theme.$menuTextColor,
    fontSize: 16
  },
  signInInfo: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 30
  },
  signOut: {
    paddingBottom: 30
  },
  userNameText: {
    color: theme.$menuTextColor,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left'
  },
  userMailText: {
    color: theme.$menuTextColor,
    fontSize: 16,
    textAlign: 'left'
  },
  IconNameWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  menuItemIcon: {
    fontSize: 19,
    color: theme.$menuIconsColor,
    marginRight: 5
  },
  arrowIcon: {
    fontSize: 16,
    color: theme.$menuIconsColor
  },
  hintText: {
    fontSize: 14,
    color: theme.$menuIconsColor
  }
})

export class ProfileEdit extends Component {
  state = {
    theme: 'light',
    isToggled: false,
  };
  
  toggleTheme = async () => {
    const { theme } = this.state;
    const newTheme = theme === 'light' ? 'dark' : 'light';
    await AsyncStorage.setItem('theme', newTheme);
    await AsyncStorage.setItem('isToggled', JSON.stringify(newTheme === 'dark'));
    this.setState({ theme: newTheme });
    return newTheme;
  };
  

  async componentDidMount() {
    const { pagesActions, settings } = this.props
    pagesActions.fetch(settings.layoutId)
    if (!settings.languageCurrencyFeatureFlag) {
      setStartSettings(settings.selectedLanguage, settings.selectedCurrency)
    }

    const theme = await AsyncStorage.getItem('theme');
    if (theme) {
      this.setState({ theme });
    }
    const isToggled = await AsyncStorage.getItem('isToggled');
    if (isToggled !== null) {
      this.setState({ isToggled: JSON.parse(isToggled) });
    }
  }

  iconType = I18nManager.isRTL ? 'chevron-left' : 'chevron-right'

  renderVendorFields(themeStyles) {
    const { navigation } = this.props

    return (
      <>
        <View style={styles.signInSectionContainer}>
          <Text style={styles.signInSectionText}>
            {i18n.t('Seller').toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('VendorManageOrders')}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="archive" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Vendor Orders')}</Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('VendorManageProducts')}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="pages" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>
              {i18n.t('Vendor products')}
            </Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            navigation.navigate('VendorManageCategoriesPicker', { parent: 0 })
          }
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="add-circle" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Add product')}</Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>
      </>
    )
  }

  renderSettings(settings, themeStyles) {
    const { navigation } = this.props

    return (
      <>
        {(settings.languages.length > 1 || settings.currencies.length > 1) && (
          <View style={[styles.signInSectionContainer, themeStyles.blockContainer]}>
            <Text style={[styles.signInSectionText, themeStyles.sectionText]}>
              {i18n.t('Settings').toUpperCase()}
            </Text>
          </View>
        )}

        {settings.languages.length > 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('LanguageSelection')}
            style={[styles.signInBtnContainer, themeStyles.sectionContainer]}>
            <Text style={[styles.signInBtnText, themeStyles.sectionText]}>{i18n.t('Language')}</Text>
            <View style={[styles.IconNameWrapper]}>
              <Text style={styles.hintText}>
                {settings.selectedLanguage.langCode.toUpperCase()}
              </Text>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        )}

        {settings.currencies.length > 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('CurrencySelection')}
            style={[styles.signInBtnContainer, themeStyles.sectionContainer]}>
            <Text style={[styles.signInBtnText, themeStyles.sectionText]}>{i18n.t('Currency')}</Text>
            <View style={styles.IconNameWrapper}>
              <Text style={styles.hintText}>
                {settings.selectedCurrency.symbol.toUpperCase()}
              </Text>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        )}

          <TouchableOpacity
            onPress={() => navigation.navigate('ApplicationInformation')}
            style={[styles.signInBtnContainer, themeStyles.sectionContainer]}>
            <Text style={[styles.signInBtnText, themeStyles.sectionText]}>{i18n.t('Information about Application')}</Text>
            <View style={styles.IconNameWrapper}>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.signInBtnContainer,
              styles.toggleButton,
              this.state.theme === 'dark',
              themeStyles.sectionContainer,
            ]}
            onPress={async () => {
              const newTheme = await this.toggleTheme();
              const themeStyles = newTheme === 'light' ? lightTheme : darkTheme;
              this.setState({ themeStyles });
            }}
          >
            <Text
              style={[
                styles.signInBtnText,
                themeStyles.sectionText
              ]}
            >
              {i18n.t('Set night theme')}
            </Text>
            <View style={styles.IconNameWrapper}>
              <Switch
                value={this.state.theme === 'dark'}
                onValueChange={async () => {
                  const newTheme = await this.toggleTheme();
                  const themeStyles = newTheme === 'light' ? lightTheme : darkTheme;
                  this.setState({ themeStyles });
                }}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReviewsScreen')}
            style={[styles.signInBtnContainer, themeStyles.sectionContainer]}>
            <Text style={[styles.signInBtnText, themeStyles.sectionText]}>{i18n.t('Descriptions of vendor')}</Text>
            <View style={styles.IconNameWrapper}>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
      </>
    )
  }

  renderPages = (pages,themeStyles) => {
    const { navigation } = this.props

    return (
      <View>
        <View style={[styles.signInSectionContainer, themeStyles.blockContainer]}>
          <Text style={[styles.signInSectionText, themeStyles.sectionText]}>
            {i18n.t('Pages').toUpperCase()}
          </Text>
        </View>
        {pages.items.map((page, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={[styles.signInBtnContainer, themeStyles.sectionContainer]}
              onPress={() =>
                registerDrawerDeepLinks(
                  {
                    link: `dispatch=pages.view&page_id=${page.page_id}`,
                    payload: {
                      title: page.page
                    }
                  },
                  navigation
                )
              }>
              <Text style={[styles.signInBtnText, themeStyles.sectionText]}>{page.page}</Text>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderUserInformation = (cart, themeStyles) => {
    if (
      cart.user_data.b_firstname ||
      cart.user_data.b_lastname ||
      cart.user_data.email
    ) {
      return (
        <>
          {(cart.user_data.b_firstname ||
            cart.user_data.b_lastname ||
            cart.user_data.email) && (
            <View style={styles.signInInfo}>
              <Text style={[styles.userNameText, themeStyles.text]} numberOfLines={2}>
                {cart.user_data.b_firstname} {cart.user_data.b_lastname}
              </Text>
              <Text style={[styles.userMailText, themeStyles.text]}>{cart.user_data.email}</Text>
            </View>
          )}
        </>
      )
    }
    return null
  }

  renderSignedIn = (auth, cart, themeStyles) => {
    const { navigation } = this.props

    return (
      <>
        <View>
          {theme.$logoUrl !== '' && (
            <Image source={{ uri: theme.$logoUrl }} style={styles.logo} />
          )}
        </View>
        {!auth.logged ? (
          <View style={[styles.signInButtons, themeStyles.sectionContainer]}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={[styles.btn, {backgroundColor: '#4fbe31' }]}>
              <Text style={[styles.btnText, themeStyles.buttonText]}>
                {i18n.t('Sign in')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}
              style={[styles.btn, {backgroundColor: 'lightgreen' }]}>
              <Text style={[styles.btnText, themeStyles.buttonText]}>{i18n.t('Registration')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          this.renderUserInformation(cart, themeStyles)
        )}
      </>
    )
  }

  logoutHandler = async () => {
    const { authActions, auth } = this.props
    await authActions.unsubscribeNotifications(auth.pushNotificationId)
    await authActions.logout()
  }

  renderSignedInMenu = (themeStyles) => {
    const { navigation } = this.props

    return (
      <>
        <View style={[styles.signInSectionContainer, themeStyles.sectionContainer]}>
          <Text style={[styles.signInSectionText, themeStyles.sectionText]}>
            {i18n.t('Buyer').toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ProfileEdit')}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="person" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Profile')}</Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Orders')}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="receipt" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Orders')}</Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.logoutHandler}
          style={styles.signInBtnContainer}>
          <View style={styles.IconNameWrapper}>
            <Icon name="exit-to-app" style={styles.menuItemIcon} />
            <Text style={styles.signInBtnText}>{i18n.t('Logout')}</Text>
          </View>
          <Icon name={this.iconType} style={styles.arrowIcon} />
        </TouchableOpacity>
      </>
    )
  }

  render() {
    const { profile, pages, auth, cart, settings, nav } = this.props
    const { theme } = this.state;
    const themeStyles = theme === 'light' ? lightTheme : darkTheme;

    if (auth.fetching) {
      return <Spinner visible />
    }

    const isLightBackground = theme === 'light';
    const statusBarStyle = isLightBackground ? 'dark-content' : 'light-content';
    const statusBarBackgroundColor = isLightBackground ? '#FFFFFF' : '#000000';


    return (
      <SafeAreaView style={[styles.safeArea, themeStyles.safeArea]}>
      <ScrollView style={[styles.container, themeStyles.container]}>
        {this.renderSignedIn(auth, cart, themeStyles)}
        {settings.languageCurrencyFeatureFlag && this.renderSettings(settings, themeStyles)}
        {auth.logged && this.renderSignedInMenu(themeStyles)}
        {profile.user_type === USER_TYPE_VENDOR && this.renderVendorFields(themeStyles)}
        {this.renderPages(pages, themeStyles)}
      </ScrollView>
    </SafeAreaView>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth,
    pages: state.pages,
    cart: state.cart,
    profile: state.profile,
    settings: state.settings
  }),
  dispatch => ({
    authActions: bindActionCreators(authActions, dispatch),
    pagesActions: bindActionCreators(pagesActions, dispatch),
    settingsActions: bindActionCreators(settingsActions, dispatch)
  })
)(ProfileEdit)
