import { IonCheckbox, IonCol, IonFab, IonFabButton, IonFabList, IonIcon, IonRow, IonText } from "@ionic/react"
import { useEffect, useState } from "react"
import { getData1C, Store } from "../pages/Store"
import './Maps.css'

const URI = "https://www.google.com/maps/embed/v1/"
const API = "AIzaSyC2iBWTU8RhfUVql7o92mtRhQ6Nx2Ori4g"

// let src = "https://www.google.com/maps/embed/v1/directions?key=AIzaSyC2iBWTU8RhfUVql7o92mtRhQ6Nx2Ori4g"
//   + "&origin=62.0235204,129.7125726"
//   + "&destination=62.0335204,129.7625726"
//   + "&waypoints=62.0535204,129.7125726|62.0435204,129.7125726"

let src = ""

export function Map(props):JSX.Element {
    const [upd, setUpd] = useState(0)

    useEffect(()=>{
        let mode = props.mode.mode
        let params = props.mode.params
        src = URI + mode + "?key=" + API
        params.forEach(el => {
            src = src + "&" + el.key + "=" + el.value
        });
        setUpd(upd + 1);
    }, [props])

    let elem = <>
        <iframe
            allowFullScreen
            width       = { window.innerWidth }
            height      = { window.innerHeight - 100}           
            src         = { src }
            onClick     = { props.onClick }
        >
        </iframe>
    </>

    return elem
}

export function Maps():JSX.Element {
    const [mode, setMode] = useState(Store.getState().mode)
    const [upd, setUpd] = useState(0)

    Store.subscribe({num: 21, type: "mode", func: ()=>{
        let mode1 = Store.getState().mode
        setMode( mode1 );
        setUpd(upd + 1)
        console.log( mode1 )
    }})

    let elem = <>
        <Map mode = { mode } onClick = {()=>{
            console.log("onClick")
        }} />
    </>

    return elem
}

export function Points(props):JSX.Element {

    let points = Store.getState().points;

    function setParams(){
        let mode    = Store.getState().mode;
        let pts  = Store.getState().points;
        let points: any = []
        pts.forEach(elem => {
            if( elem.Выбран ) points = [...points, elem]
        });

        if(points.length > 0) {
            let jarr : any = [
                { key: "origin", value: "62.0275204,129.7125726" },
            ]
            let str = ""
            for(let i = 0;i < points.length;i++){
                if(points.length === (i + 1))
                    jarr = [...jarr, 
                        {key: "destination", value: points[i].lat.toString() + "," + points[i].lng.toString()}
                    ]
                else
                    if(str.length > 0)
                        str = str + "|" + points[i].lat.toString() + "," + points[i].lng.toString()
                    else
                        str = points[i].lat.toString() + "," + points[i].lng.toString()
            }   
            if(str.length > 0)
                jarr = [...jarr, {key: "waypoints", value: str}]
            Store.dispatch({type: "mode", mode: "directions",
                params: jarr,
            })
        } else {
            Store.dispatch({type: "mode", mode: "place",
                params: [{
                    key: "q", value: "62.0275204, 129.7125726" 
                }],
            })

        }

    }

    function Point(props):JSX.Element {
        let elem = <>
            <div className="m-point">
                <IonRow>
                    <IonCol size="2">
                        <IonCheckbox color="tertiary" onIonChange = {(e)=>{
                            if(e.detail.checked) {
                                props.info.Выбран = true
                            } else  props.info.Выбран = false
                            setParams()
                        }} />    
                    </IonCol>
                    <IonCol size="10">
                        <IonText>{ props.info.Адрес }</IonText>
                    </IonCol>
                </IonRow>
            </div>
        </>
        return elem
    }

    let items = <></>
    let isButton = false
    for(let i = 0; i < points.length; i++) {
        if(points[i].Выбран) isButton = true
        items = <>
            { items }   
            <Point info = { points[i] } />
        </>       
    }
    let elem = <>
       <div className={ props.pts ? "m-points" : "hidden" }>
            { items }            
            <div className = { Store.getState().inway ? "hidden" : "m-button" }
                onClick = {()=>{
                    props.setPts( false )
                    Store.dispatch({type: "inway", inway: true})
                    let pts  = Store.getState().points;
                    let points: any = []
                    pts.forEach(elem => {
                        if( elem.Выбран ) points = [...points, elem]
                    });     
                    
                    // getData1C("НаДоставку", {
                    //     Массив: points
                    // })
                }}
            >
                В маршрут
            </div>
        </div>
    </>
    return elem;
}