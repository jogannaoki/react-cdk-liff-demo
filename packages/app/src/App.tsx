import React from 'react'
import liff from '@line/liff'
import './App.css'
import Demo from './components/screens/Demo'
import LoadingPanel from './components/screens/LoadingPanel'

const liffId = process.env.REACT_APP_LIFF_ID!

export const AuthContext = React.createContext<{ idToken: string | null }>({
  idToken: null,
})
export const LoadingContext = React.createContext<{
  setIsCommunicating: React.Dispatch<React.SetStateAction<boolean>>
}>({ setIsCommunicating: () => {} })

const App: React.FC = () => {
  const [idToken, setIdToken] = React.useState<string | null>(null)
  const [isCommunicating, setIsCommunicating] = React.useState(false)
  const [signInFinished, setSignInFinished] = React.useState(false)

  React.useEffect(() => {
    const fn = async () => {
      await liff.init({ liffId })
      if (!liff.isLoggedIn()) {
        liff.login()
      }
      const idToken = liff.getIDToken()
      setIdToken(idToken)
      setSignInFinished(true)
    }
    fn()
  }, [])

  if (!signInFinished) {
    return <></>
  } else {
    return (
      <AuthContext.Provider value={{ idToken }}>
        <LoadingContext.Provider value={{ setIsCommunicating }}>
          <Demo />
          <LoadingPanel needsToShow={isCommunicating} />
        </LoadingContext.Provider>
      </AuthContext.Provider>
    )
  }
}

export default App
