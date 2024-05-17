import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  I18nManager
} from 'react-native'
import {
  DISCUSSION_DISABLED,
  DISCUSSION_RATING,
  DISCUSSION_COMMUNICATION_AND_RATING,
  REPORT_TYPE_VENDOR
} from '../constants'
import { v4 as uuidv4 } from 'uuid'

// Utils
import i18n from '../utils/i18n'

// Actions
import * as vendorActions from '../redux/actions/vendorActions'
import * as productsActions from '../redux/actions/productsActions'

// Components
import Spinner from '../components/Spinner'
import StarsRating from '../components/StarsRating'
import Section from '../components/Section'
import SectionRow from '../components/SectionRow'
import DiscussionList from '../components/DiscussionList'
import DetailDescription from '../components/DetailDescription'
import theme from '../config/theme'

const RATING_STAR_SIZE = 14

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: theme.$screenBackgroundColor,
    paddingHorizontal: I18nManager.isRTL
      ? theme.$containerPadding / 2
      : theme.$containerPadding,
    marginLeft: I18nManager.isRTL ? theme.$containerPadding : 0
  },
  logoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  logo: {
    height: 60,
    width: 100,
    resizeMode: 'contain'
  },
  descriptionWrapper: {
    marginBottom: 20
  },
  vendorName: {
    paddingBottom: 10,
    fontSize: 16,
    textAlign: 'left',
    fontWeight: '500',
    color: theme.$darkColor
  },
  vendorDescription: {
    color: 'gray',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'left'
  },
  contactsWrapper: {
    marginBottom: 20
  },
  address: {
    color: 'gray',
    fontSize: 14,
    textAlign: 'left'
  },
  noPadding: {
    padding: 0,
    paddingTop: 6
  },
  sectionBtn: {
    paddingTop: 12,
    paddingBottom: 6
  },
  sectionBtnText: {
    color: theme.$buttonWithoutBackgroundTextColor,
    fontSize: 16,
    textAlign: 'center'
  }
})

export class VendorDetail extends Component {
  constructor(props) {
    super(props)

    this.requestSent = true
    this.state = {
      currentVendor: null,
      discussion: {
        average_rating: 0,
        posts: [],
        search: {
          page: 1,
          total_items: 0
        }
      }
    }
  }

  componentDidMount() {
    const { vendorActions, route } = this.props
    const { vendorId } = route.params
    const { discussion } = this.state

    vendorActions.fetch(vendorId, undefined, { page: discussion.search.page })
  }

  componentDidUpdate() {
    const { vendors, discussion } = this.props
    const { currentVendor } = this.state

    if (vendors.currentVendor && Object.keys(discussion.items).length) {
      const activeDiscussion =
        discussion.items[`m_${vendors.currentVendor.company_id}`]
      if (currentVendor !== vendors.currentVendor && activeDiscussion) {
        this.setState({
          currentVendor: vendors.currentVendor,
          discussion: activeDiscussion
        })
      }
    }
  }

  handleLoadMore() {
    const { discussion } = this.state
    const { vendors } = this.props
    const hasMore = discussion.search.total_items != discussion.posts.length

    if (hasMore && !this.requestSent && !this.props.discussion.fetching) {
      this.requestSent = true
      this.props.productsActions.fetchDiscussion(
        vendors.currentVendor.company_id,
        {
          page: discussion.search.page + 1
        },
        'M'
      )
    }
  }

  renderLogo() {
    const { vendors } = this.props

    return (
      <Section>
        <View style={styles.logoWrapper}>
          <Image
            source={{ uri: vendors.currentVendor.logo_url }}
            style={styles.logo}
          />
        </View>
      </Section>
    )
  }

  renderDesc() {
    const { discussion } = this.state
    const { vendors, navigation } = this.props
    let isRatingVisible = true

    if (
      vendors.currentVendor.discussion_type !== DISCUSSION_RATING &&
      vendors.currentVendor.discussion_type !==
        DISCUSSION_COMMUNICATION_AND_RATING
    ) {
      isRatingVisible = false
    }

    return (
      <Section topDivider>
        <View style={styles.descriptionWrapper}>
          <Text style={styles.vendorName}>{vendors.currentVendor.company}</Text>
          {isRatingVisible && (
            <StarsRating
              value={discussion.average_rating}
              isRatingSelectionDisabled
              size={RATING_STAR_SIZE}
            />
          )}
          <DetailDescription
            description={vendors.currentVendor.description}
            id={vendors.currentVendor.company_id}
            title={vendors.currentVendor.company}
            navigation={navigation}
          />
        </View>
      </Section>
    )
  }

  renderContacts() {
    const { vendors } = this.props
    const CONTACT_INFORMATION = 'C'

    const vendorContacts = vendors.currentVendor.contact_information

    // Define field names for contact information section.
    const contactInformationData = {
      email: {
        fieldName: 'E-mail',
        fieldValue: vendorContacts.email
      }
    }

    vendors.currentVendor.contactInformationFields[
      CONTACT_INFORMATION
    ].fields.forEach(field => {
      if (
        field.field_id !== 'company_description' &&
        field.field_id !== 'plan_id'
      ) {
        contactInformationData[field.field_name] = {
          fieldName: field.description,
          fieldValue: vendorContacts[field.field_name]
        }
        if (field.field_id === 'country') {
          contactInformationData[field.field_name].fieldValue =
            field.values[vendorContacts.country]
        }
        if (field.field_id === 'state') {
          const countryCode = field.values[vendorContacts.country]
          if (countryCode && countryCode[vendorContacts.state]) {
            contactInformationData[field.field_name].fieldValue =
              countryCode[vendorContacts.state]
          }
        }
      }
    })

    return (
      <Section topDivider title={i18n.t('Contact Information')}>
        <View style={styles.contactsWrapper}>
          {Object.keys(contactInformationData).map(contact => {
            if (!contactInformationData[contact].fieldValue) {
              return null
            }
            return (
              <SectionRow
                key={uuidv4()}
                name={i18n.t(contactInformationData[contact].fieldName)}
                value={contactInformationData[contact].fieldValue}
              />
            )
          })}
        </View>
      </Section>
    )
  }

  renderDiscussion() {
    const { discussion } = this.state
    const { vendors, navigation } = this.props

    let title = i18n.t('Reviews')
    if (discussion.search.total_items != 0) {
      title = i18n.t('Reviews ({{count}})', {
        count: discussion.search.total_items
      })
    }

    return (
      <Section
        topDivider
        title={title}
        wrapperStyle={styles.noPadding}
        showRightButton={!discussion.disable_adding}
        rightButtonText={i18n.t('Write a Review')}
        onRightButtonPress={() =>
          navigation.navigate('WriteReview', {
            activeDiscussion: discussion,
            discussionType: 'M',
            discussionId: vendors.currentVendor.company_id
          })
        }>
        <DiscussionList
          infinite
          items={discussion.posts}
          type={discussion.type}
          fetching={this.props.discussion.fetching}
          onEndReached={() => this.handleLoadMore()}
          navigation={navigation}
        />
      </Section>
    )
  }

  render() {
    const { vendors, navigation } = this.props

    if (!vendors.currentVendor || vendors.fetching) {
      return <Spinner visible />
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.scrollContainer}>
          {this.renderLogo()}
          {this.renderDesc()}
          {this.renderContacts()}
          {vendors.currentVendor.discussion_type !== DISCUSSION_DISABLED &&
            this.renderDiscussion()}
          <TouchableOpacity
            style={styles.sectionBtn}
            onPress={() => {
              navigation.navigate('WriteReport', {
                report_object_id: vendors.currentVendor.company_id,
                report_type: REPORT_TYPE_VENDOR
              })
            }}>
            <Text style={styles.sectionBtnText}>
              {i18n.t('Write a Report')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    )
  }
}

export default connect(
  state => ({
    auth: state.auth,
    vendors: state.vendors,
    discussion: state.discussion
  }),
  dispatch => ({
    vendorActions: bindActionCreators(vendorActions, dispatch),
    productsActions: bindActionCreators(productsActions, dispatch)
  })
)(VendorDetail)
