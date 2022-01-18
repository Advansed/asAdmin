import { IonButton, IonContent, IonHeader, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';

import './Tab1.css';
import { useState } from 'react';
import { AssembleList, ModalForm } from '../components/Assemble';
import { Store } from './Store';
import { Login } from '../components/Login';





const Tab1: React.FC = () => {
  const [modal, setModal] = useState(false)
  const [upd,   setUpd] = useState(0);

  Store.subscribe({num: 21, type: "auth", func: ()=>{
    setUpd(upd + 1)
}})


  function Main():JSX.Element {
    let elem = <></>
    console.log( Store.getState().auth )
    if( Store.getState().auth )
      elem = <AssembleList setModal = { setModal } />
    else 
      elem  = <Login/>
    return elem
  }

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Main />
      </IonContent>
      <IonModal
            isOpen = { modal }
        >
            <ModalForm
              setModal = { setModal } 
            />
        </IonModal>
    </IonPage>
  );
};

export default Tab1;
