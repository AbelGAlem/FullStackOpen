import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  const notification = useSelector(state => state.notification)
  const dispatch = useDispatch()

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setNotification(''))
    }, 5000)
    return () => clearTimeout(timer)
  }, [notification, dispatch])

  return <div style={style}>{notification}</div>
}

export default Notification
