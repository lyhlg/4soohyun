/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IonHeader,
  // IonCardSubtitle,
  // IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonDatetime,
  IonInput,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  useIonAlert,
  IonToolbar,
  IonButtons,
  IonTitle,
} from '@ionic/react'
import { useState } from 'react'
import styled from 'styled-components'

interface InputProps {
  startDate: number
  endDate: number
  amount: number
}

interface Props extends InputProps {
  onDismiss: () => void
  onSave: ({ startDate, endDate, amount, duration }: InputProps & { duration: number }) => void
}

const RecordMilk: React.FC<Props> = ({ startDate, endDate, amount, onDismiss, onSave }) => {
  const [present] = useIonAlert()
  const [start, setStart] = useState<number>(startDate || Date.parse(new Date().toISOString()))
  // new Date(startDate).toISOString() || new Date().toISOString(),
  // )
  const [end, setEnd] = useState<number>(endDate || Date.parse(new Date().toISOString()))
  const [milkAmount, setMilkAmount] = useState<number | null>(amount || null)

  const onModifyStartDate = (e: any): void => {
    const selectedStart = Date.parse(new Date(e.detail.value).toISOString())
    const endDate = new Date(end)

    if (startDate && endDate && selectedStart > end) {
      alert(
        `분유 먹기 종료 시간은 ${endDate.getHours()}시 ${endDate.getMinutes()}분 입니다.\n종료 시간 이전으로 시작시간을 설정해 주세요.`,
      )
      // startDate = new Date(start)
      setStart(start)
    } else {
      setStart(selectedStart)
    }
  }
  const onModifyEndDate = (e: any): void => {
    const selectedEnd = Date.parse(new Date(e.detail.value).toISOString())
    const startDate = new Date(start)

    if (startDate && endDate && selectedEnd < start) {
      alert(
        `분유를 먹기 시작한 시간은 ${startDate.getHours()}시 ${startDate.getMinutes()}분 입니다.\n시작 시간 이후로 종료시간을 설정해 주세요.`,
      )
      setEnd(end)
    } else {
      setEnd(selectedEnd)
    }
  }

  const onChangeMilkAmount = (e: any): void => {
    setMilkAmount(Number(e.detail.value))
  }

  const onAddMilk = (amount: number) => (): void => {
    const value = milkAmount ? milkAmount + amount : amount
    setMilkAmount(value)
  }

  const onSaveMilkData = (): void => {
    const duration = Math.round((end - start) / 1000)

    onSave({ startDate: start, endDate: end, amount: Number(milkAmount), duration })
  }

  const onClickDelete = (): void => {
    present({
      header: '분유 기록지를 삭제하시겠습니까?',
      message: '확인을 누르시면, 해당 기록지가 삭제됩니다.',
      buttons: ['취소하기', { text: '삭제하기', handler: () => onDismiss() }],
    })
  }

  return (
    <StyledContainer>
      {/* <ion-header translucent>
        <ion-toolbar>
          <ion-title>Modal Content</ion-title>
          <ion-buttons slot='end'>
            <ion-button onclick='dismissModal()'>Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header> */}
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>분유 기록지 수정</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={onDismiss}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
        {/* <IonCardSubtitle>아이가 먹은 분유량과 시간을 기록하세요!</IonCardSubtitle>
        <IonCardTitle>분유 기록지</IonCardTitle> */}
      </IonHeader>

      <IonContent fullscreen>
        <StyleHistoryWriting>
          <IonItem>
            <IonLabel>시작 시간</IonLabel>
            <IonDatetime
              display-format='h:mm A'
              picker-format='h:mm A'
              value={new Date(start).toISOString()}
              onIonChange={onModifyStartDate}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel>종료 시간</IonLabel>
            <IonDatetime
              display-format='h:mm A'
              picker-format='h:mm A'
              value={new Date(end).toISOString()}
              onIonChange={onModifyEndDate}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel>분유 양(ml)</IonLabel>
            <IonInput
              required
              className='amount-input'
              type='number'
              value={milkAmount}
              placeholder='얼마나 먹었나요?'
              onIonChange={onChangeMilkAmount}
            ></IonInput>
          </IonItem>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  className='plus-button'
                  size='small'
                  shape='round'
                  color='light'
                  onClick={onAddMilk(10)}
                >
                  + 10ml
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  className='plus-button'
                  size='small'
                  shape='round'
                  color='light'
                  onClick={onAddMilk(30)}
                >
                  + 30ml
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  className='plus-button'
                  size='small'
                  shape='round'
                  color='light'
                  onClick={onAddMilk(90)}
                >
                  + 90ml
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton size='large' shape='round' className='width100' onClick={onClickDelete}>
                  삭제
                </IonButton>
              </IonCol>
              <IonCol className='right-align'>
                <IonButton
                  size='large'
                  className='width100'
                  shape='round'
                  color='success'
                  onClick={onSaveMilkData}
                  disabled={!milkAmount}
                >
                  수정
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </StyleHistoryWriting>
      </IonContent>
    </StyledContainer>
  )
}

const StyledContainer = styled.div``
const StyleHistoryWriting = styled.div`
  .amount-input {
    text-align: right;
    input {
      padding-right: 10px;
    }
    &::after {
      content: ' ml';
    }
  }

  .width100 {
    width: 100%;
  }

  .plus-button {
    width: 100%;
    height: 40px;
  }
`

export default RecordMilk
