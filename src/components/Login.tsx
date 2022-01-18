import { IonButton, IonCard, IonInput, IonItem, IonLabel, IonList, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react"
import { useHistory } from "react-router";
import { getData1C, Store } from "../pages/Store";
import "./Login.css"

let log = localStorage.getItem("asAdmin.login")
if(log === undefined) log = ""
const iLogin = {
    Логин:      log, 
    Пароль:   "",
}

export function Login(props):JSX.Element {
    const [ info, setInfo] = useState<any>( iLogin ) 

    useEffect(()=>{

    })

    async function LogIn(){
        let res = await getData1C("Логин", info)
        if(res.Код === 100) {
            Store.dispatch({ type: "auth", auth: true})
            Store.dispatch(res.Данные);
            console.log(res)
            localStorage.setItem("asAdmin.login", info.Логин)
        } else {

        }
    }
    let elem = <>
        <IonCard class = "l-card">
            <div className="l-list">
            <IonItem>
                    <IonInput
                        type = "text"
                        value = { info.Логин }
                        placeholder = "Логин"
                        onIonChange={(e)=>{
                            info.Логин = e.detail.value as string;
                        }}
                    >
                    </IonInput>
                </IonItem>
                <IonItem>
                    <IonInput
                        placeholder = "Пароль"
                        type = "password"
                        value = { info.Пароль }
                        onIonChange={(e)=>{
                            info.Пароль = e.detail.value as string;
                        }}
                    >
                    </IonInput>
                </IonItem>
            </div>
            <IonToolbar class="l-tool">
                <IonButton
                    slot = "end"
                    onClick={()=>{
                        LogIn();                       
                    }}
                >
                    Войти
                </IonButton>
            </IonToolbar>
        </IonCard>
    </>
    return elem
}