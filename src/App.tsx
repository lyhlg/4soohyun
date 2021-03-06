/* eslint-disable @typescript-eslint/no-explicit-any */
import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  useIonAlert,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { barChartOutline, speedometerOutline, waterOutline } from 'ionicons/icons' //medalOutline
import { Chart, Main, Milk, Peepoo } from './pages'
import { encode } from 'js-base64'
import userAtom from 'src/recoil/user'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/* Theme variables */
import './theme/variables.css'
import { RecoilRoot, useRecoilState } from 'recoil'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getUserKey, setUserKey } from './utils/native'

// Firebase App (the core Firebase SDK) is always required and must be listed first
// import firebaseOrigin from 'firebase/app'
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// import { useEffect, useState } from 'react'

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field

const App: React.FC = () => {
  const [user, setUser] = useState('')
  const [password, setPassword] = useState('')
  const [present] = useIonAlert()

  // const [confirm, setConfirm] = useState(false)
  const [{ userId }, setUserState] = useRecoilState(userAtom)

  const onChangeUserName = (e: any): void => {
    setUser(e.detail.value)
  }

  const onChangePassword = (e: any): void => {
    setPassword(e.detail.value)
  }

  const onStart = (): void => {
    const userId = `${encode(user)}-${encode(password)}`
    if (user && password) {
      present({
        header: '???? ????????????',
        message: '???????????? ???????????? ????????? ????????? ????????? ??????????????? ??? ??????????????????!',
        buttons: [
          '????????????',
          {
            text: '????????????',
            handler: async () => {
              await setUserKey(user, password)
              setUserState({ userId })
            },
          },
        ],
      })
    }
  }

  const findUserName = async (): Promise<void> => {
    const value = await getUserKey()
    if (value) {
      const [userName, password] = value?.split('-')

      if (userName && password) {
        setUserState({ userId: value })
      }
    }
  }

  useEffect(() => {
    findUserName()
  }, [])

  return (
    <IonApp>
      {userId ? (
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route path='/main'>
                <Main />
              </Route>
              <Route exact path='/milk'>
                <Milk />
              </Route>
              <Route exact path='/peepoo'>
                <Peepoo />
              </Route>
              <Route exact path='/chart'>
                <Chart />
              </Route>
              <Route exact path='/'>
                <Redirect to='/main' />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
              <IonTabButton tab='chart' href='/chart'>
                <IonIcon icon={barChartOutline} />
                <IonLabel>??????</IonLabel>
              </IonTabButton>
              <IonTabButton tab='main' href='/main'>
                <IonIcon icon={speedometerOutline} />
                <IonLabel>????????????</IonLabel>
              </IonTabButton>
              <IonTabButton tab='milk' href='/milk'>
                <IonIcon icon={waterOutline} />
                <IonLabel>??????</IonLabel>
              </IonTabButton>
              {/* <IonTabButton tab='peepoo' href='/peepoo'>
                  <IonIcon icon={medalOutline} />
                  <IonLabel>???/??????</IonLabel>
                </IonTabButton> */}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      ) : (
        <StyledContainer>
          <IonItem>
            <IonLabel className='label'>????????? ??????</IonLabel>
            <IonInput
              className='form-input'
              required
              value={user}
              onIonChange={onChangeUserName}
            ></IonInput>
          </IonItem>
          <IonItem>
            <IonLabel className='label'>????????????</IonLabel>
            <IonInput
              className='form-input'
              type='password'
              required
              value={password}
              onIonChange={onChangePassword}
            ></IonInput>
          </IonItem>
          <StyledButton>
            <IonButton disabled={!user || !password} onClick={onStart}>
              ????????????
            </IonButton>
          </StyledButton>
        </StyledContainer>
      )}
    </IonApp>
  )
}

const StyledContainer = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);

  .label {
    width: 80px;
  }

  .form-input {
    /* text-align: right; */
    input {
      padding-left: 30px;
    }
  }

  input {
  }
`

const StyledButton = styled.div`
  margin-top: 50px;
`

const AppWrapper: React.FC = () => {
  return (
    <RecoilRoot>
      <App />
    </RecoilRoot>
  )
}

export default AppWrapper
