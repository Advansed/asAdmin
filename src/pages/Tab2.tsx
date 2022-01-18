import { IonContent, IonHeader, IonModal, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useState } from 'react';
import { BarcodeScanner } from '@awesome-cordova-plugins/barcode-scanner';

import './Tab2.css';
import { Assemble, ModalGood } from '../components/Assemble';
import { Store } from './Store';

const Tab2: React.FC = () => {
  const [modal, setModal]   = useState(false)
  const [text, setText]     = useState("")


  const openScanner         = async () => {

      const data = await BarcodeScanner.scan();
      Store.dispatch({ type : "barcode", barcode: data})

  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Assemble
            onScanner = { openScanner }
            setModal = { setModal }
        />  
      </IonContent>
      <IonModal
            isOpen = { modal }
        >
            <ModalGood
              setModal = { setModal } 
            />
        </IonModal>

    </IonPage>
  );
};

export default Tab2;
