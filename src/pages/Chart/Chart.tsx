import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react'

const Chart: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>준비중입니다.</IonTitle>
          </IonToolbar>
        </IonHeader>
        <p>화려한 그래프가 들어갈 예정 🍉</p>
      </IonContent>
    </IonPage>
  )
}

export default Chart
