import { Redirect, Route } from 'react-router-dom'
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import { statsChartOutline, waterOutline } from 'ionicons/icons' //medalOutline
import { Main, Milk, Peepoo } from './pages'

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
import { RecoilRoot } from 'recoil'

// Firebase App (the core Firebase SDK) is always required and must be listed first
// import firebaseOrigin from 'firebase/app'
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// import { useEffect, useState } from 'react'

// For Firebase JavaScript SDK v7.20.0 and later, `measurementId` is an optional field

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <IonApp>
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
              <Route exact path='/'>
                <Redirect to='/main' />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot='bottom'>
              <IonTabButton tab='main' href='/main'>
                <IonIcon icon={statsChartOutline} />
                <IonLabel>통계</IonLabel>
              </IonTabButton>
              <IonTabButton tab='milk' href='/milk'>
                <IonIcon icon={waterOutline} />
                <IonLabel>분유</IonLabel>
              </IonTabButton>
              {/* <IonTabButton tab='peepoo' href='/peepoo'>
                <IonIcon icon={medalOutline} />
                <IonLabel>대/소변</IonLabel>
              </IonTabButton> */}
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </RecoilRoot>
  )
}

export default App
