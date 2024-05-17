import { NOTIFICATION_HIDE, NOTIFICATION_SHOW } from '../../constants'

export function hide(id) {
  toast.hideAll()
  return dispatch => {
    dispatch({
      type: NOTIFICATION_HIDE,
      payload: {
        id
      }
    })
  }
}

export function show(
  params = {
    type: 'success',
    title: '',
    text: ''
  }
) {
  toast.show(params.text, {
    type: 'custom_toast',
    placement: 'top',
    animationDuration: 100,
    data: {
      title: params.title,
      notificationType: params.type
    }
  })

  return dispatch => {
    dispatch({
      type: NOTIFICATION_SHOW,
      payload: {
        ...params
      }
    })
  }
}
