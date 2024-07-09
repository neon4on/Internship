import React, { useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Button,
  Alert
} from 'react-native';
import theme from '../config/theme';

// Utils
import toInteger from 'lodash/toInteger';
import get from 'lodash/get';
import i18n from '../utils/i18n';
import {
  PRODUCT_IMAGE_WIDTH,
  formatPrice,
  getImagePath,
  PRODUCT_NUM_COLUMNS
} from '../utils';

// Components
import StarsRating from './StarsRating';
import { add as addToCart } from '../redux/actions/cartActions'; // Импортируем действие

const RATING_STAR_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: theme.$productBorderColor,
    borderRadius: theme.$borderRadius,
    backgroundColor: '#fff',
    margin: 5,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: PRODUCT_IMAGE_WIDTH + 175, // Увеличенная высота
    maxWidth: `${Math.floor(94 / PRODUCT_NUM_COLUMNS)}%`
  },
  productImage: {
    width: PRODUCT_IMAGE_WIDTH,
    height: PRODUCT_IMAGE_WIDTH
  },
  description: {
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  productName: {
    color: '#2b2b2b',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  productPrice: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.$darkColor
  },
  listDiscountWrapper: {
    backgroundColor: theme.$productDiscountColor,
    position: 'absolute',
    top: 4,
    right: 4,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
    borderRadius: theme.$borderRadius,
    width: 100
  },
  priceWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  listPriceText: {
    textDecorationLine: 'line-through',
    color: theme.$darkColor,
    textAlign: 'center',
    paddingRight: 4,
    paddingTop: 2,
    fontSize: 12
  },
  listDiscountText: {
    color: '#fff',
    textAlign: 'left'
  },
  rating: {
    marginLeft: -10,
    marginRight: -10,
    marginTop: 0
  },
  quantityWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: theme.$productBorderColor,
    padding: 5,
    borderRadius: 5
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16
  }
});

const ProductListView = ({ product, settings, auth, onPress }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});
  const dispatch = useDispatch();

  const coupons = useSelector(state => state.cart.coupons);

  const handleAddToCart = () => {
    const { item } = product;
    console.log('Attempting to add to cart:', item);

    const cartItem = {
      [item.product_id]: {
        product_id: item.product_id,
        amount: quantity,
        product_options: selectedOptions
      }
    };

    console.log('Dispatching add to cart action with:', cartItem);
    dispatch(addToCart(cartItem, true, coupons))
      .then((response) => {
        console.log('Product added to cart successfully:', response);
        Alert.alert('Успех', 'Товар добавлен в корзину');
      })
      .catch((error) => {
        console.error('Error adding product to cart:', error);
        Alert.alert('Ошибка', 'Не удалось добавить товар в корзину. Пожалуйста, попробуйте еще раз.');
      });
  };

  

  const renderDiscount = () => {
    const { item } = product;

    if (!item.list_discount_prc && !item.discount_prc) {
      return null;
    }

    const discount = item.list_discount_prc || item.discount_prc;

    return (
      <View style={styles.listDiscountWrapper}>
        <Text style={styles.listDiscountText} numberOfLines={1}>
          {i18n.t('Discount')} {`${discount}%`}
        </Text>
      </View>
    );
  };

  const renderPrice = () => {
    const { item } = product;
    const productTaxedPrice = get(item, 'taxed_price_formatted.price', '');
    const productPrice =
      productTaxedPrice || get(item, 'price_formatted.price', product.price);
    let discountPrice = null;

    if (toInteger(item.discount_prc)) {
      discountPrice = item.base_price_formatted.price;
    } else if (toInteger(item.list_price)) {
      discountPrice = item.list_price_formatted.price;
    }

    const isProductPriceZero = Math.ceil(item.price) === 0;
    const showDiscount =
      !isProductPriceZero && (item.discount_prc || item.list_discount_prc);
    const isForbiddenShopping =
      settings.checkout.allowAnonymousShopping === 'hide_price_and_add_to_cart';

    const renderProductPrice = () => {
      if (isForbiddenShopping && !auth.logged) {
        return (
          <Text numberOfLines={2} style={styles.productPrice}>
            {i18n.t('Sign in to view price')}
          </Text>
        );
      }

      return (
        <Text numberOfLines={1} style={styles.productPrice}>
          {formatPrice(productPrice)}
        </Text>
      );
    };

    return (
      <View style={styles.priceWrapper}>
        {showDiscount && (
          <Text style={styles.listPriceText}>{discountPrice}</Text>
        )}
        {isProductPriceZero ? (
          <Text>{i18n.t('Contact us for a price')}</Text>
        ) : (
          renderProductPrice()
        )}
      </View>
    );
  };

  const renderRating = () => {
    return (
      <StarsRating
        value={product.item.average_rating}
        size={RATING_STAR_SIZE}
        isRatingSelectionDisabled
      />
    );
  };

  const { item } = product;
  const imageUri = getImagePath(item);

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress(item)}>
      <View>
        {imageUri !== null && (
          <Image
            style={styles.productImage}
            source={{ uri: imageUri }}
            resizeMode="contain"
            resizeMethod="resize"
          />
        )}
      </View>
      {renderDiscount()}
      <View style={styles.description}>
        <Text numberOfLines={2} style={styles.productName}>
          {item.product}
        </Text>
        {renderRating()}
        {renderPrice()}
        <View style={styles.quantityWrapper}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(Math.max(1, quantity - 1))}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => setQuantity(quantity + 1)}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <Button title="Добавить в корзину" onPress={handleAddToCart} />
      </View>
    </TouchableOpacity>
  );
};

const MemoizedProductListView = React.memo(ProductListView);

export default connect(state => ({
  settings: state.settings,
  auth: state.auth
}))(MemoizedProductListView);
