import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { COLORS, FONTS } from '../../constants'
import { AuthContext, LoadingContext } from '../../../App'
import axios from 'axios'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 23,
    fontFamily: FONTS.MAIN_FONT,
    color: COLORS.DIMGRAY,
  },
  border: {
    borderTopWidth: 1,
    borderColor: COLORS.LIGHTGRAY,
  },
  body: {
    fontSize: 12,
    textAlign: 'center',
    margin: 23,
    fontFamily: FONTS.MAIN_FONT,
  },
})

const apiUrl = process.env.REACT_APP_API_URL!

export const demoAPI = axios.create({
  baseURL: apiUrl,
})

export default function MembersCard() {
  const [lineUserId, setLineUserId] = React.useState('')
  const { idToken } = React.useContext(AuthContext)
  const { setIsCommunicating } = React.useContext(LoadingContext)

  React.useEffect(() => {
    const fn = async () => {
      setIsCommunicating(true)
      const res = await demoAPI
        .get('/demo', {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        })
        .catch(error => console.dir(error))
      if (res) {
        console.log(res)
        setLineUserId(res.data.lineUserId)
      }
      setIsCommunicating(false)
    }
    fn()
  }, [idToken, setIsCommunicating])

  return (
    <View style={styles.container}>
      <Text style={styles.header}>LINE Demo App</Text>
      <View style={styles.border} />
      <Text style={styles.body}>Hello, {lineUserId}</Text>
    </View>
  )
}
