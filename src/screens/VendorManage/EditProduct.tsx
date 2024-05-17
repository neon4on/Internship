import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import DeviceInfo from 'react-native-device-info'
import * as yup from 'yup'
import ActionSheet from '@alessiocancian/react-native-actionsheet'
import i18n from '../../utils/i18n'
import { getProductStatus } from '../../utils'
import { launchImageLibrary } from 'react-native-image-picker'
import theme from '../../config/theme'
import {
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  I18nManager
} from 'react-native'
import {
  PRODUCT_STATUS_REQUIRES_APPROVAL,
  PRODUCT_STATUS_DISAPPROVED,
  FIELD_INPUT
} from '../../constants/index'
import { Formik, Field } from 'formik'

// Components
import Section from '../../components/Section'
import Spinner from '../../components/Spinner'
import Icon from '../../components/Icon'
import BottomActions from '../../components/BottomActions'
import FormField from '../../components/FormField'

// Actions
import * as productsActions from '../../redux/actions/vendorManage/productsActions'
import * as imagePickerActions from '../../redux/actions/imagePickerActions'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.$containerPadding,
    backgroundColor: theme.$screenBackgroundColor
  },
  scrollContainer: {
    paddingBottom: 14
  },
  menuItem: {
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10
  },
  menuItemTitle: {
    color: '#8f8f8f',
    fontSize: 13,
    paddingBottom: 4,
    textAlign: 'left'
  },
  menuItemText: {
    width: '90%',
    color: theme.$darkColor
  },
  menuItemSubTitle: {
    color: theme.$darkColor,
    textAlign: 'left'
  },
  btnIcon: {
    color: theme.$mediumGrayColor
  },
  horizontalScroll: {
    marginTop: 20,
    marginLeft: 20
  },
  imgWrapper: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    padding: 4,
    marginRight: 10,
    minWidth: 100,
    minHeight: 100,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  img: {
    width: 100,
    height: 100
  },
  addImageIcon: {
    fontSize: 48,
    color: 'red'
  },
  inputContainer: {
    marginTop: 15
  },
  submitBtn: {
    marginTop: 15,
    backgroundColor: '#4fbe31',
    borderRadius: 3
  },
  imagePickerWrapper: {
    padding: 20,
    backgroundColor: '#fff'
  },
  sectionText: {
    color: theme.$buttonBackgroundColor
  }
})
export class EditProduct extends Component {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
    // Navigation.events().bindComponent(this);

    this.state = {
      photos: [],
      isPhotosGot: false,
      loading: true
    }
  }

  getMoreActionsList = () => {
    return [i18n.t('Delete This Product'), i18n.t('Cancel')]
  }

  async componentDidMount() {
    const { productsActions, showClose, route } = this.props
    const { productID } = route.params
    await productsActions.fetchProduct(productID)
    if (!this.state.isPhotosGot) {
      this.getSavedPhotos()
      this.setState({ isPhotosGot: true })
    }

    this.setState({ loading: false })

    navigation.setOptions({
      headerRight: setTrashIcon
    })
  }

  handleMoreActionSheet = index => {
    const { product, productsActions, showClose } = this.props
    if (index === 0) {
      productsActions.deleteProduct(product.product_id)

      if (showClose) {
        // Navigation.dismissAllModals();
      } else {
        // Navigation.pop(componentId);
      }
    }
  }

  handleStatusActionSheet = index => {
    const { product, productsActions } = this.props
    const statuses = ['A', 'H', 'D']
    const activeStatus = statuses[index]

    if (activeStatus) {
      productsActions.updateProduct(product.product_id, {
        status: activeStatus
      })
    }
  }

  handleSave = values => {
    const { product, productsActions, categories, route } = this.props
    const { productID } = route.params
    const { photos } = this.state

    if (!values) {
      return
    }

    const data = {
      images: photos,
      ...values
    }

    if (categories.length) {
      data.category_ids = categories[0].category_id
    }

    productsActions
      .updateProduct(product.product_id, data)
      .then(() => productsActions.fetchProduct(productID, false))
  }

  handleRemoveImage = async imageIndex => {
    const { imagePickerActions } = this.props
    const newPhotos = [...this.state.photos]
    newPhotos.splice(imageIndex, 1)
    this.setState({ photos: [...newPhotos] })

    await imagePickerActions.toggle(newPhotos)
  }

  renderImagePicker = async () => {
    const { imagePickerActions } = this.props
    let granted = ''

    if (Platform.OS === 'android') {
      try {
        const deviceVersion = Number(DeviceInfo.getSystemVersion())

        if (deviceVersion >= 13) {
          granted = PermissionsAndroid.RESULTS.GRANTED
        } else {
          granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: i18n.t('App Media Permission'),
              message: i18n.t('Allow to access photos, media on your device?'),
              buttonNegative: i18n.t('Cancel'),
              buttonPositive: i18n.t('OK')
            }
          )
        }

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(i18n.t('Photo gallery permission denied'))
        }
      } catch (error) {
        let errorMessage = 'Permission error'
        if (error instanceof Error) {
          errorMessage = error.message
        }
        console.log(errorMessage)
      }
    }

    try {
      const photos = await launchImageLibrary({
        mediaType: 'photo',
        selectionLimit: 0
      })

      if (photos.assets) {
        const newPhotos = photos.assets.map(photo => photo.uri)
        const oldPhotos = [...this.state.photos]
        this.setState({ photos: [...oldPhotos, ...newPhotos] })

        const photosUris = photos.assets.map(photo => photo.uri)
        await imagePickerActions.toggle(photosUris)
      }
    } catch (error) {
      console.log('error: ', error)
    }
  }

  getSavedPhotos = () => {
    const { product } = this.props
    const savedPhotos = []

    if (product.main_pair) {
      savedPhotos.push(product.main_pair.icon.image_path)
    }

    if (product.image_pairs) {
      product.image_pairs.forEach(item => {
        savedPhotos.push(item.icon.image_path)
      })
    }

    this.setState({ photos: [...savedPhotos] })
  }

  renderImages = () => {
    const { product, navigation } = this.props
    const { photos } = this.state
    const isProductOffer = !!product.master_product_id

    return (
      <ScrollView contentContainerStyle={styles.horizontalScroll} horizontal>
        {photos.map((item, index) => (
          <View style={styles.imgWrapper} key={index}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Gallery', {
                  images: [item],
                  onRemove: () => this.handleRemoveImage(index)
                })
              }}>
              <Image source={{ uri: item }} style={styles.img} />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )
  }

  renderMenuItem = (
    title,
    subTitle,
    fn = () => {},
    isProductOffer = false,
    isStatusChanging = true
  ) => (
    <TouchableOpacity
      style={styles.menuItem}
      activeOpacity={isProductOffer || !isStatusChanging ? 1 : 0}
      onPress={isProductOffer || !isStatusChanging ? null : fn}>
      <View style={styles.menuItemText}>
        <Text style={styles.menuItemTitle}>{title}</Text>
        <Text style={styles.menuItemSubTitle}>{subTitle}</Text>
      </View>
      {!isProductOffer && isStatusChanging && (
        <Icon
          name={
            I18nManager.isRTL ? 'keyboard-arrow-left' : 'keyboard-arrow-right'
          }
          style={styles.btnIcon}
        />
      )}
    </TouchableOpacity>
  )

  getStatusActionsList = () => {
    return [
      i18n.t('Make Product Active'),
      i18n.t('Make Product Hidden'),
      i18n.t('Make Product Disabled'),
      i18n.t('Cancel')
    ]
  }

  render() {
    const { product, productsActions, isUpdating, route, navigation } =
      this.props
    const { productID } = route.params
    const { loading } = this.state

    if (loading || !product) {
      return <Spinner visible />
    }

    const isProductOffer = !!product.master_product_id

    const formFields = {
      product: {
        name: 'product',
        label: i18n.t('Name'),
        editable: !isProductOffer,
        fieldType: FIELD_INPUT
      },
      full_description: {
        name: 'full_description',
        label: i18n.t('Full description'),
        numberOfLines: 4,
        editable: !isProductOffer,
        i18n: {
          optional: '',
          required: ''
        },
        multiline: true,
        clearButtonMode: 'while-editing',
        fieldType: FIELD_INPUT
      },
      price: {
        name: 'price',
        label: i18n.t('Price'),
        fieldType: FIELD_INPUT
      }
    }

    const validationSchema = yup.object({
      product: yup.string().required(
        i18n.t('The {{field}} field is required', {
          field: i18n.t('Name'),
          interpolation: { escapeValue: false }
        })
      ),
      full_description: yup.string(),
      price: yup
        .number()
        .typeError(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
        .required(
          i18n.t('The {{field}} field is required', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
        .positive(
          i18n.t('Enter a valid {{field}}', {
            field: i18n.t('Price'),
            interpolation: { escapeValue: false }
          })
        )
    })

    let isStatusChanging = true

    if (
      product.status === PRODUCT_STATUS_REQUIRES_APPROVAL ||
      product.status === PRODUCT_STATUS_DISAPPROVED
    ) {
      isStatusChanging = false
    }

    return (
      <View style={styles.container}>
        <Formik
          validationSchema={validationSchema}
          initialValues={{
            product: product.product,
            full_description: product.full_description,
            price: product.price.toString()
          }}
          onSubmit={values => this.handleSave(values)}>
          {({ handleSubmit }) => (
            <>
              <ScrollView contentContainerStyle={styles.scrollContainer}>
                {this.renderImages()}
                <TouchableOpacity
                  style={styles.imagePickerWrapper}
                  onPress={() => {
                    this.renderImagePicker()
                  }}>
                  <Text style={styles.sectionText}>
                    {i18n.t('Select image')}
                  </Text>
                </TouchableOpacity>
                <Section>
                  {Object.keys(formFields).map((key, index) => (
                    // We use index bacause Formik doesn't understand uuidv4
                    <View key={index} style={styles.inputContainer}>
                      <Field
                        component={FormField}
                        name={formFields[key].name}
                        label={formFields[key].label}
                        fieldType={formFields[key].fieldType}
                        {...formFields[key]}
                      />
                    </View>
                  ))}
                </Section>
                <Section wrapperStyle={{ padding: 0 }}>
                  {this.renderMenuItem(
                    i18n.t('Status'),
                    getProductStatus(product.status).text,
                    () => {
                      this.StatusActionSheet.show()
                    },
                    undefined,
                    isStatusChanging
                  )}
                  {this.renderMenuItem(
                    i18n.t('Pricing / Inventory'),
                    `${product.product_code}, ${i18n.t('List price')}: ${
                      product.list_price
                    }, ${i18n.t('In stock')}: ${product.amount}`,
                    () => {
                      navigation.push('VendorManagePricingInventory')
                    }
                  )}
                  {this.renderMenuItem(
                    i18n.t('Categories'),
                    product.categories.map(item => item.category).join(', '),
                    () => {
                      navigation.push('VendorManageCategoriesPicker', {
                        selected: product.categories,
                        parent: 0,
                        onCategoryPress: item => {
                          productsActions.changeProductCategory(item)
                        }
                      })
                    },
                    isProductOffer
                  )}
                  {this.renderMenuItem(
                    i18n.t('Shipping properties'),
                    `${i18n.t('Weight (lbs)')}: ${product.weight}${
                      product.free_shipping
                        ? `, ${i18n.t('Free shipping')}`
                        : ''
                    }`,
                    () =>
                      navigation.push('VendorManageShippingProperties', {
                        productID
                      })
                  )}
                  {this.renderMenuItem(
                    i18n.t('Features'),
                    i18n.t('Edit Features'),
                    () =>
                      navigation.push('VendorManageFeatures', {
                        productID
                      })
                  )}
                </Section>
              </ScrollView>
              <BottomActions
                onBtnPress={handleSubmit}
                btnText={i18n.t('Save')}
              />
            </>
          )}
        </Formik>
        <ActionSheet
          ref={ref => {
            this.ActionSheet = ref
          }}
          options={this.getMoreActionsList()}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this.handleMoreActionSheet}
        />
        <ActionSheet
          ref={ref => {
            this.StatusActionSheet = ref
          }}
          options={this.getStatusActionsList()}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this.handleStatusActionSheet}
        />
        {isUpdating && <Spinner visible mode="modal" />}
      </View>
    )
  }
}

export default connect(
  state => ({
    isUpdating: state.vendorManageProducts.loading,
    product: state.vendorManageProducts.current,
    categories: state.vendorManageCategories.selected
  }),
  dispatch => ({
    imagePickerActions: bindActionCreators(imagePickerActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(EditProduct)
