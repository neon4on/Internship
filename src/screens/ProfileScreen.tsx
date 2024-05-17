import React, { Component } from 'react'
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
  I18nManager
} from 'react-native'

// Actions
import * as pagesActions from '../redux/actions/pagesActions'
import * as authActions from '../redux/actions/authActions'
import * as settingsActions from '../redux/actions/settingsActions'
import { setStartSettings } from '../redux/actions/appActions'

// Components
import Icon from '../components/Icon'
import Spinner from '../components/Spinner'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
  componentDidMount() {
    const { pagesActions, settings } = this.props
    pagesActions.fetch(settings.layoutId)
    if (!settings.languageCurrencyFeatureFlag) {
      setStartSettings(settings.selectedLanguage, settings.selectedCurrency)
    }
  }

  iconType = I18nManager.isRTL ? 'chevron-left' : 'chevron-right'

  renderVendorFields() {
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

  renderSettings(settings) {
    const { navigation } = this.props
    return (
      <>
        {(settings.languages.length > 1 || settings.currencies.length > 1) && (
          <View style={styles.signInSectionContainer}>
            <Text style={styles.signInSectionText}>
              {i18n.t('Settings').toUpperCase()}
            </Text>
          </View>
        )}

        {settings.languages.length > 1 && (
          <TouchableOpacity
            onPress={() => navigation.navigate('LanguageSelection')}
            style={styles.signInBtnContainer}>
            <Text style={styles.signInBtnText}>{i18n.t('Language')}</Text>
            <View style={styles.IconNameWrapper}>
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
            style={styles.signInBtnContainer}>
            <Text style={styles.signInBtnText}>{i18n.t('Currency')}</Text>
            <View style={styles.IconNameWrapper}>
              <Text style={styles.hintText}>
                {settings.selectedCurrency.symbol.toUpperCase()}
              </Text>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
        )}
      </>
    )
  }

  renderPages = pages => {
    const { navigation } = this.props

    return (
      <View>
        <View style={styles.signInSectionContainer}>
          <Text style={styles.signInSectionText}>
            {i18n.t('Pages').toUpperCase()}
          </Text>
        </View>
        {pages.items.map((page, index) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.signInBtnContainer}
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
              <Text style={styles.signInBtnText}>{page.page}</Text>
              <Icon name={this.iconType} style={styles.arrowIcon} />
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  renderUserInformation = cart => {
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
              <Text style={styles.userNameText} numberOfLines={2}>
                {cart.user_data.b_firstname} {cart.user_data.b_lastname}
              </Text>
              <Text style={styles.userMailText}>{cart.user_data.email}</Text>
            </View>
          )}
        </>
      )
    }
    return null
  }

  renderSignedIn = (auth, cart) => {
    const { navigation } = this.props

    return (
      <>
        <View>
          {theme.$logoUrl !== '' && (
            <Image source={{ uri: theme.$logoUrl }} style={styles.logo} />
          )}
        </View>
        {!auth.logged ? (
          <View style={styles.signInButtons}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}
              style={{ ...styles.btn, backgroundColor: '#4fbe31' }}>
              <Text style={{ ...styles.btnText, color: '#fff' }}>
                {i18n.t('Sign in')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('Registration')}
              style={styles.btn}>
              <Text style={styles.btnText}>{i18n.t('Registration')}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          this.renderUserInformation(cart)
        )}
      </>
    )
  }

  logoutHandler = async () => {
    const { authActions, auth } = this.props
    await authActions.unsubscribeNotifications(auth.pushNotificationId)
    await authActions.logout()
  }

  renderSignedInMenu = () => {
    const { navigation } = this.props

    return (
      <>
        <View style={styles.signInSectionContainer}>
          <Text style={styles.signInSectionText}>
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
    const { profile, pages, auth, cart, settings } = this.props

    if (auth.fetching) {
      return <Spinner visible />
    }

    return (
      <ScrollView style={styles.container}>
        {this.renderSignedIn(auth, cart)}

        {settings.languageCurrencyFeatureFlag && this.renderSettings(settings)}

        {auth.logged && this.renderSignedInMenu()}

        {profile.user_type === USER_TYPE_VENDOR && this.renderVendorFields()}

        {this.renderPages(pages)}
      </ScrollView>
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
