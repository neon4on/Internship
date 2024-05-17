import React, { PureComponent } from 'react'
import { Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from './Icon'
import theme from '../config/theme'

const styles = StyleSheet.create({
  default: {
    backgroundColor: theme.$darkColor,
    borderRadius: 4,
    padding: 14
  },
  defaultText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14
  },
  primary: {
    backgroundColor: theme.$buttonBackgroundColor,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 22,
    paddingRight: 22,
    borderRadius: 4
  },
  disabledPrimary: {
    backgroundColor: '#d4d4d4',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 22,
    paddingRight: 22,
    borderRadius: 4
  },
  primaryText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 16
  },
  round: {
    backgroundColor: theme.$buttonBackgroundColor,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 28,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 6,
    marginBottom: 6
  },
  roundText: {
    textAlign: 'center',
    color: theme.$buttonWithBackgroundTextColor,
    fontSize: 13
  },
  ghost: {
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: theme.$buttonBackgroundColor,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 6
  },
  ghostText: {
    textAlign: 'center',
    color: theme.$buttonBackgroundColor,
    fontSize: 13
  },
  label: {
    backgroundColor: '#d9d9d9',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 6
  },
  labelText: {
    textAlign: 'center',
    color: '#000',
    fontSize: 13
  },
  labelActive: {
    backgroundColor: theme.$buttonBackgroundColor
  },
  labelActiveText: {
    color: '#fff'
  },
  clear: {},
  clearIcon: {
    fontSize: 16,
    color: '#fff',
    position: 'absolute',
    right: 4,
    top: 4
  }
})

export default class extends PureComponent {
  getStyleByType() {
    const { type, clear } = this.props

    switch (type) {
      case 'labelActive':
        return {
          btn: {
            ...styles.label,
            ...styles.labelActive
          },
          btnText: {
            ...styles.labelActiveText
          }
        }

      case 'label':
        return {
          btn: styles.label,
          btnText: styles.labelText
        }

      case 'ghost':
        return {
          btn: styles.ghost,
          btnText: styles.ghostText
        }

      case 'round':
        return {
          btn: {
            ...styles.round,
            paddingRight: clear ? 28 : 12
          },
          btnText: styles.roundText
        }

      case 'disabledPrimary':
        return {
          btn: styles.disabledPrimary,
          btnText: styles.primaryText
        }

      case 'primary':
        return {
          btn: styles.primary,
          btnText: styles.primaryText
        }

      default:
        return {
          btn: styles.default,
          btnText: styles.defaultText
        }
    }
  }

  render() {
    const { style, children, clear } = this.props

    return (
      <TouchableOpacity
        style={[this.getStyleByType().btn, style]}
        {...this.props}>
        <Text style={[this.getStyleByType().btnText]}>{children}</Text>
        {clear && <Icon name="close" style={styles.clearIcon} />}
      </TouchableOpacity>
    )
  }
}
