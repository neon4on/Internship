import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  StyleSheet
} from 'react-native'
import theme from '../config/theme'
import Icon from '../components/Icon'

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: '#fff',
    borderRadius: theme.$borderRadius,
    paddingTop: 5
  },
  blockHeader: {
    fontWeight: 'bold',
    fontSize: 20,
    color: theme.$categoriesHeaderColor,
    marginLeft: 14,
    marginRight: 14,
    marginBottom: 10,
    textAlign: 'left'
  },
  btn: {
    paddingLeft: 14,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: theme.$grayColor,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  btnText: {
    fontSize: 16,
    color: theme.$darkColor,
    width: '90%',
    textAlign: 'left'
  },
  arrowIcon: {
    fontSize: 16,
    color: theme.$menuIconsColor
  }
})

/**
 * Renders a block with a list of pages.
 *
 * @reactProps {string} name - Block name.
 * @reactProps {string} wrapper - Renders name if exists.
 * @reactProps {object[]} items - Pages information.
 * @reactProps {function} onPress - Opens a page.
 */
export default class PageBlock extends Component {
  /**
   * @ignore
   */
  static propTypes = {
    name: PropTypes.string,
    wrapper: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.object),
    onPress: PropTypes.func
  }

  static defaultProps = {
    items: []
  }

  /**
   * Renders item.
   *
   * @param {object} item - Page information.
   * @param {number} index - Page index.
   */
  renderItem = (item, index) => (
    <TouchableOpacity
      key={index}
      style={styles.btn}
      onPress={() => this.props.onPress(item)}>
      <Text style={styles.btnText}>{item.page}</Text>
      <Icon
        name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  )

  /**
   * Renders component
   *
   * @return {JSX.Element}
   */
  render() {
    const { items, name, wrapper } = this.props
    const itemsList = items.map((item, index) => this.renderItem(item, index))
    return (
      <View style={styles.container}>
        {wrapper !== '' && <Text style={styles.blockHeader}>{name}</Text>}
        {itemsList}
      </View>
    )
  }
}
