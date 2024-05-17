import { useEffect } from 'react'
import messaging from '@react-native-firebase/messaging'
import PushNotification from 'react-native-push-notification'

const NotificationController = props => {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.createChannel({
        channelId: 'csnative',
        channelName: 'csnative'
      })

      PushNotification.localNotification({
        channelId: 'csnative',
        message: remoteMessage.notification.body,
        title: remoteMessage.notification.title,
        picture: remoteMessage.notification.android.smallIcon
      })
    })
    return unsubscribe
  }, [])

  return null
}

export default NotificationController
