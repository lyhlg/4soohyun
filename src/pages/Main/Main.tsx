/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  // IonItemDivider,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
  useIonModal,
  IonSpinner,
} from '@ionic/react'
import ko from 'date-fns/locale/ko'
import { format, formatDistance } from 'date-fns'

import { Fragment, useEffect, useMemo, useState } from 'react'
import { readUserDate, removeUserDate, updateUserData } from 'src/utils/firebase'
import styled from 'styled-components'
import userAtom, { userSelector } from 'src/recoil/user'

import './main.css'
import { Link } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import { createOutline, trashOutline } from 'ionicons/icons'
import { RecordMilk } from 'src/components'

const Main: React.FC = () => {
  const userName = useRecoilValue(userSelector.getUserName)
  const [isLoading, setLoading] = useState(false)
  const [userData, setUserData] = useState<
    { startDate: number; endDate: number; duration: number; amount: number; key: string }[]
  >([])
  const [userTmpDataBaseOnKey, setUserTmpData] = useState<any>(null)
  const [userTmpKey, setUserTmpKey] = useState<any>('')
  const userState = useRecoilValue(userAtom)
  const handleDismiss = (): void => {
    modalDismiss()
  }
  const [present] = useIonAlert()
  const [modalPresent, modalDismiss] = useIonModal(RecordMilk, {
    // startDate: userD
    onDismiss: handleDismiss,
    startDate: userTmpDataBaseOnKey?.startDate,
    endDate: userTmpDataBaseOnKey?.endDate,
    amount: userTmpDataBaseOnKey?.amount,
    onSave: (props: { startDate: number; endDate: number; amount: number; duration: number }) => {
      updateUserData(userState.userId, userTmpKey, props)
      handleDismiss()
      getUserData()
    },
  })

  const [startDate, setStartDate] = useState<number>(userState.startDate || new Date().getTime())
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
    const start = new Date(startDate)
    start.setUTCHours(-9, 0, 0, 0)
    const end = new Date(startDate)
    end.setUTCHours(14, 59, 59, 999)

    return userData
      .filter(item => {
        return (
          Date.parse(start.toISOString()) < item.startDate &&
          item.startDate < Date.parse(end.toISOString())
        )
      })
      .reverse()
  }, [startDate, userData])

  const getUserData = async (): Promise<void> => {
    setLoading(true)
    const list = await readUserDate(userState.userId)
    setUserData(list)
    setLoading(false)
  }

  const onEdit = (key: string) => () => {
    const data = userData.find(item => item.key === key)
    if (data) {
      setUserTmpData(data)
      setUserTmpKey(key)
      modalPresent()
    }
  }
  const onDelete = (key: string) => () => {
    present({
      header: '해당 기록을 삭제하시겠습니까?',
      message: '확인을 누르시면, 해당 기록지가 삭제됩니다.',
      buttons: [
        '취소하기',
        {
          text: '삭제하기',
          handler: () => {
            removeUserDate(userState.userId, key)
            setTimeout(getUserData, 2000)
          },
        },
      ],
    })
  }

  useIonViewWillEnter(() => {
    getUserData()
  })
  useEffect(() => {}, [])

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>대시보드</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <StyledContainer>
          <IonItem>
            <IonLabel>날짜</IonLabel>
            <IonDatetime
              display-format='YYYY.MM.DD'
              picker-format='YYYY.MM.DD'
              value={new Date(startDate).toISOString()}
              onIonChange={onChangeStartDate}
            ></IonDatetime>
          </IonItem>

          {isLoading ? (
            <StyledLoading>
              <IonSpinner />
            </StyledLoading>
          ) : sortedData.length > 0 ? (
            <>
              <IonCard>
                <IonCardHeader>
                  <IonCardSubtitle>
                    <span className='user-name'>{userName}</span> 아기의 일일 기록표 입니다.
                  </IonCardSubtitle>
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
                        <h4>분유량</h4>
                      </IonText>
                    </StyledColumn>
                  </StyledRow>
                </StyledHead>

                {sortedData?.map((item, i) => {
                  return (
                    <Fragment key={i.toString()}>
                      <IonItemSliding>
                        <IonItem>
                          <StyledRow>
                            <StyledColumn>{format(new Date(item.startDate), 'HH:mm')}</StyledColumn>
                            <StyledColumn>{Math.ceil(item.duration / 60)} 분</StyledColumn>
                            <StyledColumn>{item.amount} ml</StyledColumn>
                          </StyledRow>
                        </IonItem>
                        <IonItemOptions>
                          <IonItemOption color='primary' onClick={onEdit(item.key)}>
                            <IonIcon slot='end' icon={createOutline}></IonIcon>
                            수정
                          </IonItemOption>
                          <IonItemOption color='danger' onClick={onDelete(item.key)}>
                            <IonIcon slot='end' icon={trashOutline} />
                            삭제
                          </IonItemOption>
                        </IonItemOptions>
                      </IonItemSliding>
                      <>
                        {i !== sortedData.length - 1 && (
                          <StyledDistance>
                            {formatDistance(
                              new Date(item.startDate),
                              new Date(sortedData[i + 1].startDate),
                              {
                                locale: ko,
                              },
                            )}
                          </StyledDistance>
                        )}
                      </>
                    </Fragment>
                  )
                })}
              </StyledTable>
            </>
          ) : (
            <IonText className='padding-text' color='dark'>
              <div>
                <h5>해당 날짜에 기록이 없어요</h5>
                <Link to='/milk'>기록 하러 가기!⭐️</Link>
              </div>
            </IonText>
          )}
        </StyledContainer>
      </IonContent>
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
    div {
      text-align: center;
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .user-name {
    text-decoration: underline;
  }
`

const StyledTable = styled.div`
  padding: 20px;
`

const StyledHead = styled.div``

const StyledRow = styled.div`
  display: flex;
  padding: 10px 0;
  width: 100%;
`

const StyledColumn = styled.div`
  flex: 1;
  text-align: center;
`

const StyledDistance = styled.div`
  color: #e0a3a3;
  padding: 0 50px;
`

const StyledLoading = styled.div`
  text-align: center;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
`

export default Main
