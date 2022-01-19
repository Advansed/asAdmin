import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonIcon, IonMenuButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import { Points, Maps } from '../components/Maps';
import { menuOutline } from 'ionicons/icons'
import './Tab3.css';
import { useState } from 'react';

const Tab3: React.FC = () => {
  const [pts, setPts] = useState (false)
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="start" color = "light"
            onClick = {()=>{
              setPts( !pts )
            }}
          >
            <IonIcon icon = { menuOutline }/>
          </IonButton>
          <IonTitle>Tab 3</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div>
          <Points pts = { pts } setPts = { setPts } />
          <Maps />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;
