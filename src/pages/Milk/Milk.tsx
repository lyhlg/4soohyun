import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonDatetime,
  IonGrid,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react'
import { Storage } from '@capacitor/storage'
import { useState } from 'react'
import { useRecoilState, useResetRecoilState } from 'recoil'
import milkAtom from 'src/recoil/milk'
import styled from 'styled-components'

// import './milk.css';

const Milk: React.FC = () => {
  const [milkState, setMilkState] = useRecoilState(milkAtom)
  const resetMilkAtom = useResetRecoilState(milkAtom)
  const [isEnd, setEndStatus] = useState(false)
  const [milkValue, setMilkValue] = useState<number | null>(null)
  const [present] = useIonAlert()

  const stateInit = (): void => {
    setEndStatus(false)
    resetMilkAtom()
    setMilkValue(null)
  }

  const onStartEat = (): void => {
    stateInit()
    setMilkState({
      startDate: new Date(),
      endDate: null,
      duration: null,
    })
  }

  const onEndEat = (): void => {
    const endDate = new Date()
    const startDate = milkState.startDate
    if (startDate) {
      setMilkState({
        ...milkState,
        endDate,
        duration: Math.round((endDate.getTime() - startDate.getTime()) / 1000),
      })
      setEndStatus(true)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeMilkValue = (e: any): void => {
    setMilkValue(Number(e.detail.value))
  }

  const onAddMilk = (amount: number) => (): void => {
    const value = milkValue ? milkValue + amount : amount
    setMilkValue(value)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onModifyendDate = (e: any): void => {
    let endDate = new Date(e.detail.value) ?? new Date()
    const startDate = milkState.startDate

    if (startDate && endDate && endDate < startDate) {
      alert(
        `분유를 먹기 시작한 시간은 ${startDate.getHours()}시 ${startDate.getMinutes()}분 입니다.\n시작 시간 이후로 종료시간을 설정해 주세요.`,
      )
      endDate = new Date()
    }

    if (startDate) {
      setMilkState({
        ...milkState,
        endDate,
        duration: Math.round((endDate.getTime() - startDate.getTime()) / 1000),
      })
      setEndStatus(true)
    }
  }

  const onClickDelete = (): void => {
    present({
      header: '분유 기록지를 삭제하시겠습니까?',
      message: '확인을 누르시면, 해당 기록지가 삭제됩니다.',
      buttons: ['취소하기', { text: '삭제하기', handler: () => stateInit() }],
    })
  }

  const onSave = async (): Promise<void> => {
    // await Storage.clear()
    const { value } = await Storage.get({ key: 'userData' })
    console.log(value)

    const _value = value ? JSON.parse(value) : []
    const newData = { ...milkState, amount: milkValue }
    _value.push(newData)
    await Storage.set({
      key: 'userData',
      value: JSON.stringify(_value),
    })

    console.log(value, _value)
    console.log('[저장]', milkState.startDate, milkState.endDate, `${milkState.duration} 초`)
    stateInit()
  }
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Milk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {!isEnd && (
          <StyledContainer>
            <IonGrid>
              <IonRow>
                {!milkState.startDate ? (
                  <IonCol>
                    <IonButton
                      className='milk-control-button'
                      size='large'
                      shape='round'
                      onClick={onStartEat}
                      disabled={!!milkState.startDate}
                    >
                      시작 🍼
                    </IonButton>
                  </IonCol>
                ) : (
                  <IonCol className='right-align'>
                    <IonButton
                      className='milk-control-button'
                      size='large'
                      shape='round'
                      color='success'
                      onClick={onEndEat}
                    >
                      종료
                    </IonButton>
                  </IonCol>
                )}
              </IonRow>
            </IonGrid>
          </StyledContainer>
        )}

        {isEnd && (
          <IonCard>
            <IonCardHeader>
              <IonCardSubtitle>아이가 먹은 분유량과 시간을 기록하세요!</IonCardSubtitle>
              <IonCardTitle>분유 기록지</IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <StyleHistoryWriting>
                <IonItem>
                  <IonLabel>시작 시간</IonLabel>
                  <IonDatetime
                    display-format='h:mm A'
                    picker-format='h:mm A'
                    value={milkState.startDate?.toISOString()}
                    onIonChange={onModifyendDate}
                  ></IonDatetime>
                </IonItem>
                <IonItem>
                  <IonLabel>종료 시간</IonLabel>
                  <IonDatetime
                    display-format='h:mm A'
                    picker-format='h:mm A'
                    value={milkState.endDate?.toISOString() ?? new Date().toISOString()}
                    onIonChange={onModifyendDate}
                  ></IonDatetime>
                </IonItem>
                <IonItem>
                  <IonLabel>분유 양(ml)</IonLabel>
                  <IonInput
                    required
                    className='amount-input'
                    type='number'
                    value={milkValue}
                    placeholder='얼마나 먹었나요?'
                    onIonChange={onChangeMilkValue}
                  ></IonInput>
                </IonItem>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton size='small' shape='round' color='light' onClick={onAddMilk(30)}>
                        + 30
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton size='small' shape='round' color='light' onClick={onAddMilk(60)}>
                        + 60
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton size='small' shape='round' color='light' onClick={onAddMilk(90)}>
                        + 90
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>

                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        size='large'
                        shape='round'
                        className='width100'
                        onClick={onClickDelete}
                      >
                        삭제
                      </IonButton>
                    </IonCol>
                    <IonCol className='right-align'>
                      <IonButton
                        size='large'
                        className='width100'
                        shape='round'
                        color='success'
                        onClick={onSave}
                        disabled={!milkState.endDate || !milkValue}
                      >
                        저장
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </StyleHistoryWriting>
            </IonCardContent>
          </IonCard>
        )}

        {/* <ExploreContainer name='Tab 1 page' /> */}
      </IonContent>
    </IonPage>
  )
}

const StyledContainer = styled.div`
  padding: 20px 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  .milk-control-button {
    width: 100%;
    height: 100px;
  }

  .right-align {
    text-align: end;
  }
`

// const StyledButtonWrapper = styled.div``

const StyleHistoryWriting = styled.div`
  .amount-input {
    text-align: right;
    &::after {
      content: ' ml';
      padding-right: 10px;
    }
  }

  .width100 {
    width: 100%;
  }
`

export default Milk
