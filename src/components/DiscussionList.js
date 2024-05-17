import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native'
import StarsRating from './StarsRating'
import {
  DISCUSSION_COMMUNICATION,
  DISCUSSION_COMMUNICATION_AND_RATING,
  DISCUSSION_RATING,
  REPORT_TYPE_DISCUSSION,
  REPORT_TYPE_USER
} from '../constants'
import i18n from '../utils/i18n'
import theme from '../config/theme'
import { v4 as uuidv4 } from 'uuid'
import Icon from '../components/Icon'

const RATING_STAR_SIZE = 14

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  msg: {
    color: theme.$discussionMessageColor,
    marginTop: 0,
    paddingBottom: 10,
    textAlign: 'justify'
  },
  itemContainer: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderColor: '#d9d9d9'
  },
  itemContainerNoBorder: {
    borderBottomWidth: 0,
    marginBottom: 0
  },
  itemWrapper: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 10
  },
  name: {
    fontSize: 14,
    textAlign: 'left',
    color: theme.$darkColor
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  emptyText: {
    fontSize: 14,
    color: 'gray',
    paddingBottom: 10,
    paddingTop: 4
  },
  reportIconContainer: {
    width: '100%',
    marginBottom: 10
  },
  menuItemIcon: {
    fontSize: 24,
    color: theme.$buttonWithoutBackgroundTextColor,
    textAlign: 'right'
  }
})

export default class DiscussionList extends Component {
  renderItem(item, index) {
    const { type, items, navigation } = this.props
    const showRating =
      type === DISCUSSION_RATING || type === DISCUSSION_COMMUNICATION_AND_RATING

    const showMessage =
      type === DISCUSSION_COMMUNICATION_AND_RATING ||
      type === DISCUSSION_COMMUNICATION

    const noUnderlineStyle = items.length === index + 1

    const reportTypes = [
      {
        value: REPORT_TYPE_DISCUSSION,
        title: i18n.t('Report review')
      },
      {
        value: REPORT_TYPE_USER,
        title: i18n.t('Report user')
      }
    ]

    const pickerValues = reportTypes.map(variant => variant.title)

    const changePickerValueHandler = value => {
      const selectedVariant = reportTypes.find(
        variant => variant.title.toLowerCase() === value.toLowerCase()
      )

      return {
        report_object_id:
          selectedVariant.value === REPORT_TYPE_DISCUSSION
            ? item.post_id
            : item.user_id,
        report_type: selectedVariant.value
      }
    }

    return (
      <View
        key={uuidv4()}
        style={[
          styles.itemContainer,
          noUnderlineStyle && styles.itemContainerNoBorder
        ]}>
        <View style={styles.itemWrapper}>
          <Text style={styles.name}>{item.name}</Text>
          {showRating && item.rating_value > 0 && (
            <StarsRating
              value={item.rating_value}
              size={RATING_STAR_SIZE}
              isRatingSelectionDisabled
            />
          )}
        </View>
        {showMessage && <Text style={styles.msg}>{item.message}</Text>}
        <TouchableOpacity
          style={styles.reportIconContainer}
          onPress={() => {
            navigation.navigate('ScrollPicker', {
              pickerValues: pickerValues,
              changePickerValueHandler,
              selectValue: '',
              title: i18n.t('Write a Report'),
              nextScreen: 'WriteReport'
            })
          }}>
          <Icon name="report-problem" style={styles.menuItemIcon} />
        </TouchableOpacity>
      </View>
    )
  }

  renderEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>{i18n.t('No posts found')}</Text>
    </View>
  )

  render() {
    const { items } = this.props

    if (!items.length) {
      return this.renderEmpty()
    }

    return (
      <View style={styles.container}>
        {items.map((item, index) => {
          return this.renderItem(item, index)
        })}
      </View>
    )
  }
}
