/* eslint-disable @typescript-eslint/no-explicit-any */
import { Storage } from '@capacitor/storage'
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  // IonItemDivider,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonViewWillEnter,
} from '@ionic/react'

import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'

import './main.css'

const Main: React.FC = () => {
  const [userData, setUserData] = useState<
    { startDate: Date; endDate: Date; duration: number; amount: number }[]
  >([])

  const [startDate, setStartDate] = useState(new Date().toISOString())
  // const [endDate, setEndDate] = useState(new Date().toISOString())
  const onChangeStartDate = (e: any): void => {
    e.preventDefault()
    // if (e.detail.value > endDate) {
    //   alert('시작일이 종료일보다 이후 일 수 없습니다.')
    //   start = startDate
    // }
    setStartDate(e.detail.value)
  }

  // const onChangeEndDate = (e: any): void => {
  //   let end = e.detail.value
  //   if (e.detail.value < startDate) {
  //     alert('종료일이 시작일보다 이전 일 수 없습니다.')
  //     end = endDate
  //   }
  //   setEndDate(end)
  // }
  const sortedData = useMemo(() => {
    return userData
      .filter(item => {
        const selectedMonth = new Date(startDate).getMonth()
        const selectedDate = new Date(startDate).getDate()
        return (
          new Date(item.startDate).getMonth() === selectedMonth &&
          new Date(item.startDate).getDate() === selectedDate
        )
      })
      .reverse()
  }, [startDate, userData])

  const getUserData = async (): Promise<void> => {
    const { value } = await Storage.get({ key: 'userData' })
    setUserData(value ? JSON.parse(value) : [])
  }

  useIonViewWillEnter(() => {
    getUserData()
  })
  useEffect(() => {}, [])

  return (
    <IonPage>
      <StyledContainer>
        <IonHeader>
          <IonToolbar>
            <IonTitle>통계</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonItemDivider>
            <IonLabel>날짜를 선택 해주세요</IonLabel>
          </IonItemDivider>

          <IonItem>
            <IonLabel>날짜</IonLabel>
            <IonDatetime
              display-format='YYYY.MM.DD'
              picker-format='YYYY.MM.DD'
              value={startDate}
              onIonChange={onChangeStartDate}
            ></IonDatetime>
          </IonItem>
          {/* 
          <IonItemDivider>
            <IonLabel>종료일을 선택 해주세요</IonLabel>
          </IonItemDivider>
          <IonItem>
            <IonLabel>종료</IonLabel>
            <IonDatetime
              display-format='YYYY.MM.DD'
              picker-format='YYYY.MM.DD'
              value={endDate}
              onIonChange={onChangeEndDate}
            ></IonDatetime>
          </IonItem> */}

          {sortedData.length > 0 ? (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>일일 기록표 입니다.</IonCardSubtitle>
                  <IonCardTitle>대시보드</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <IonItem>
                    <IonLabel>총 분유량</IonLabel>
                    <IonInput
                      className='input-milk'
                      type='number'
                      required
                      value={sortedData.reduce((acc, it) => acc + it.amount, 0)}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonLabel>평균 분유량 (총 {sortedData.length}회)</IonLabel>
                    <IonInput
                      className='input-milk'
                      type='number'
                      required
                      value={Math.ceil(
                        sortedData.reduce((acc, it) => acc + it.amount, 0) / sortedData.length,
                      )}
                    ></IonInput>
                  </IonItem>
                </IonCardContent>
              </IonCard>
              <StyledTable>
                <StyledHead>
                  <StyledRow>
                    <StyledColumn>
                      <IonText color='dark'>
                        <h4>시작시간</h4>
                      </IonText>
                    </StyledColumn>
                    <StyledColumn>
                      <IonText color='dark'>
                        <h4>소요시간</h4>
                      </IonText>
                    </StyledColumn>
                    <StyledColumn>
                      <IonText color='dark'>
                        <h4>양(ml)</h4>
                      </IonText>
                    </StyledColumn>
                  </StyledRow>
                </StyledHead>
                {sortedData?.map((item, i) => {
                  return (
                    <StyledRow key={i.toString()}>
                      <StyledColumn>
                        {new Date(item.startDate).getHours()}시{' '}
                        {new Date(item.startDate).getMinutes()}분
                      </StyledColumn>
                      <StyledColumn>{Math.ceil(item.duration / 60)} 분</StyledColumn>
                      <StyledColumn>{item.amount}</StyledColumn>
                    </StyledRow>
                  )
                })}
              </StyledTable>
            </>
          ) : (
            <IonText className='padding-text' color='dark'>
              <h5>해당 날짜에 기록이 없어요</h5>
            </IonText>
          )}
        </IonContent>
      </StyledContainer>
    </IonPage>
  )
}

const StyledContainer = styled.div`
  .input-milk {
    text-align: right;
    &::after {
      content: ' ml';
      padding-right: 10px;
    }
  }
  .padding-text {
    h5 {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`

const StyledTable = styled.div`
  padding: 20px;
`

const StyledHead = styled.div``

const StyledRow = styled.div`
  display: flex;
  padding: 10px 0;
`

const StyledColumn = styled.div`
  flex: 1;
  text-align: center;
`

export default Main
