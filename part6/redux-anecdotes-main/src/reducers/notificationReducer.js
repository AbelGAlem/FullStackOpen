import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { message: '', timeout: 0 },
  reducers: {
    setNotification: (state, action) => {
      return action.payload
    },
    clearNotification: () => {
      return { message: '', timeout: 0 }
    }
  }
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const setNotificationWithTimeout = (message, timeoutSeconds) => {
  return (dispatch) => {
    dispatch(setNotification({ message, timeout: timeoutSeconds * 1000 }))
    
    setTimeout(() => {
      dispatch(clearNotification())
    }, timeoutSeconds * 1000)
  }
}

export default notificationSlice.reducer

