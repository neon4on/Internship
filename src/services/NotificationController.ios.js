import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import PushNotificationIos from '@react-native-community/push-notification-ios'

const NotificationController = props => {
  useEffect(() => {
    // Usesd to display notification when app is in foreground
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotificationIos.addNotificationRequest({
        id: remoteMessage.messageId,
        body: remoteMessage.notification.body,
        title: remoteMessage.notification.title
      })
    })

    return unsubscribe
  }, [])

  return null
}

export default NotificationController
