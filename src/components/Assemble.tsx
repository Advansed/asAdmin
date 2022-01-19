import { IonButton, IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonRow, IonText, IonToolbar } from "@ionic/react"
import { barcodeOutline, search } from "ionicons/icons";
import { useEffect, useState } from "react"
import { useHistory } from "react-router";
import { getData1C, Orders, Store } from "../pages/Store";


export function     AssembleList(props):JSX.Element {
    const [info, setInfo] = useState<any>([])
    let hist = useHistory()

    useEffect(()=>{
        let orders = Store.getState().orders;
        setInfo(orders);
    },[])

    function setModal( bb : boolean) {
        props.setModal( bb )
    }

    Store.subscribe({num: 1, type: "orders", func: () => {
        let orders = Store.getState().orders;
        setInfo(orders);
    }})

    let items = <></>
    for(let i = 0; i < info.length; i++) {
        items = <>
            { items }
            <Item info = { info[i] }/>
        </>
    }

    async function Take( info ) {
        let res = await getData1C("ВзятьНаСборку", {
              Номер:      info.Номер
            , Дата:       info.Дата
            , ГУИД:      Store.getState().login.guid
        })
        if(res.Код === 100) {
            Orders()
            hist.push("/tab2")    
        } else {
            hist.push("/tab1")    
        }
    }

    
    function Item(props):JSX.Element {
        const [info, setInfo] = useState<any>(props.info)

        let elem = <>
            <IonCard>
            <IonCardHeader>
                    { "Заказ " + getNum(info.Номер) + " от " +  DatetoStr(info.Дата) }
                </IonCardHeader>
                <IonCardHeader>
                    { info.АдресДоставки }
                </IonCardHeader>
                <IonToolbar //class = "ml-1 mr-1 mb-1 mt-1" 
                >
                    <IonButton
                        slot = "start"
                        expand="block"
                        color = "secondary"
                        onClick = {()=>{
                             Store.dispatch({ type: "param", param: info })
                             setModal( true )    
                        }}
                    >
                        Товары
                    </IonButton>
                    <IonButton
                        slot = "end"
                        expand="block"
                        color = "success"
                        onClick = {()=>{
                            Take( info )   
                        }}
                    >
                        На сборку
                    </IonButton>
                </IonToolbar>
            </IonCard>
        </>

        return elem
    }



    let elem = <>
        { items }
    </>

    return elem
}

export function     ModalForm(props) {
    const [order, setOrder] = useState<any> ()
    const [info, setInfo] = useState<any>([])

    let hist = useHistory();

    useEffect(()=>{
        let order = Store.getState().param
        setOrder(order)
        getInfo(order);
    },[])

    async function getInfo( order ){
        let res = await getData1C("ТоварыСборки", {
            Номер : order.Номер,
            Дата:   order.Дата,
        })
        setInfo( res )
    }

    Store.subscribe({num: 2, type: "param", func: ()=>{
        let order = Store.getState().order
        setOrder(order)
        getInfo(order);
    }})

    async function Take( info ) {
        let res = await getData1C("ВзятьНаСборку", {
              Номер:      info.Номер
            , Дата:       info.Дата
            , ГУИД:      Store.getState().login.guid
        })
        if(res.Код === 100) {
            Orders()
            props.setModal( false )
            hist.push("/tab2")    
        } else {
            props.setModal( false )
            hist.push("/tab1")    
        }
    }

    let items = <></>

    for(let i = 0; i < info?.length;i++){
        items = <>
            { items }
            <IonItem>   
                <IonText>
                    { info[i].Номенклатура }
                </IonText>
                <IonText slot = "end">
                    { info[i].План }
                </IonText>
                <IonText slot = "end">
                    { info[i].Факт }
                </IonText>
            </IonItem>
        </>
    }

    let elem = <>
        <div className="a-scroll">
            <IonCard>
                <IonCardHeader>
                    <div>
                        { 
                            "Заказ " + order?.Номер + " от " + DatetoStr (order?.Дата ) 
                        }
    
                    </div>
                    <div>
                        { order?.АдресДоставки }
                    </div>
                </IonCardHeader>
                <IonList>
                    <IonItem>   
                        <IonText>
                            Номенклатура
                        </IonText>
                        <IonText slot = "end">
                            План
                        </IonText>
                        <IonText slot = "end">
                            Факт
                        </IonText>
                    </IonItem>
                    { items }
                </IonList>
                <IonToolbar>
                    <IonButton
                        slot = "start"
                        onClick = {()=>{
                        props.setModal( false)
                        }}
                    >
                        Отмена
                    </IonButton>
                    <IonButton
                        slot = "end"
                        onClick = {()=>{
                            let param = Store.getState().order
                            if(param === "")    
                                Take( order )
                            else 
                                hist.push("/tab2");
                        }}    
                    >
                        На сборку
                    </IonButton>
                </IonToolbar>
            </IonCard>
        </div>
    </>
    return elem
}

export function     Assemble(props) {
    const [order, setOrder] = useState<any>()
    const [info, setInfo] = useState<any>([])
    const [barcode, setBarcode] = useState("")
    const [upd, setUpd] = useState(0)

    let hist = useHistory();
    useEffect(()=>{
        let order = Store.getState().order 
        if(order !== ""){
            setOrder( order)
            getInfo( order )        
        }            
        else {setOrder(undefined); setInfo([])}
    },[])

    async function getInfo( order ){
        let res = await getData1C("ТоварыСборки", {
            Номер : order.Номер,
            Дата:   order.Дата,
        })
        setInfo( res )
    }

    Store.subscribe({num: 2, type: "order", func: ()=>{
        let order = Store.getState().order 
        if(order !== ""){
            setOrder( order)
            getInfo( order )        
        }            
        else {setOrder(undefined); setInfo([])}
    }})

    Store.subscribe({num: 3, type: "barcode", func: ()=>{
        setBarcode( Store.getState().barcode )
    }})

    Store.subscribe({num: 4, type: "sort", func: ()=>{

        info.sort(function (a, b) {
            if (a.Факт > b.Факт) {
                return 1;
            }
            if (a.Факт < b.Факт) {
                return -1;
            }
            // a должно быть равным b
            return 0;
            });
        setInfo(info);
        setUpd(upd + 1);
    }})

    function search() {
        var ind = info.findIndex(function(b) {
            let str = JSON.stringify(b.ШтрихКоды) 
            if(str === undefined) str = ""
            return b.Код.includes(barcode) || str.includes('"' + barcode + '"') 
        });
        if(ind >= 0){
            Store.dispatch({type: "goods", goods: info[ind]})   
            props.setModal( true )     
        }
       
        setBarcode("")
        
        
    }

    let items = <></>
    for(let i = 0; i < info.length;i++){
        if(info[i].Факт === info[i].План)
            items = <>
                { items }
                <IonItem 
                   // color = "success"
                >   
                    <IonText class="mt-05 mb-05">
                        { info[i].Номенклатура }
                    </IonText>
                    <IonText slot = "end">
                        { info[i].План }
                    </IonText>
                    <IonText slot = "end" >
                        { "Ok" }
                    </IonText>
                </IonItem>
            </>
        else
            items = <>
                { items }
                <IonItem>   
                    <IonLabel position = "stacked"> { info[i].Код }</IonLabel>
                    <IonText class="mt-05 mb-05">
                        { info[i].Номенклатура }
                    </IonText>
                    <IonText slot = "end">
                        { info[i].План }
                    </IonText>
                    <IonText slot = "end" 
                        color = "success"
                    >
                        { info[i].Факт }
                    </IonText>
                </IonItem>
            </>
}

    let elem = <>
        <div className="a-scroll">
            <IonCard>
                <IonCardHeader>
                    <IonList>
                        <IonItem>
                            <IonText>{   "Заказ " + order?.Номер + " от " + DatetoStr (order?.Дата ) }</IonText>   
                        </IonItem>
                        <IonItem>
                            <IonText>{ order?.АдресДоставки }</IonText>
                        </IonItem>
                        <IonItem>
                            <IonLabel position = "stacked"> ШтрихКод </IonLabel>
                            <IonInput 
                                value = { barcode }
                                onIonChange={(e) => {
                                    setBarcode( e.detail.value as string )    
                                }}
                            />
                            <IonButton
                                slot = "end"
                                onClick= {()=>{ 
                                    if(barcode === "")  props.onScanner() 
                                    else search()
                                }}
                            >
                                <IonIcon icon= { barcodeOutline } slot = "icon-only" />
                            </IonButton>
                        </IonItem>
                    </IonList>
                </IonCardHeader>
                <IonList>
                    <IonItem>   
                        <IonText>
                            Номенклатура
                        </IonText>
                        <IonText slot = "end">
                            План
                        </IonText>
                        <IonText slot = "end">
                            Факт
                        </IonText>
                    </IonItem>
                    { items }
                </IonList>
                <IonToolbar>
                    <IonButton
                        slot = "start"
                        onClick = {()=>{
                        }}
                    >
                        Отмена
                    </IonButton>
                    <IonButton
                        slot = "end"
                        onClick = {()=>{
                            getData1C("ЗаказСобран", {
                                Номер:      order.Номер, 
                                Дата:       order.Дата,
                                ГУИД:       Store.getState().login.guid
                            })   
                            Store.dispatch({type: "order", order: ""})   
                            hist.push("/tab1")
                        }}
                    >
                        Собран
                    </IonButton>
                </IonToolbar>
            </IonCard>
        </div>
    </>
    return elem
}

export function     ModalGood(props):JSX.Element {
    const [info, setInfo] = useState<any>([])

    useEffect(()=>{
        let good = Store.getState().goods;
        setInfo(good);
    }, [])

    Store.subscribe({num: 4, type: "goods", func: ()=>{
        let good = Store.getState().goods;
        setInfo(good);
    }})

    let elem = <>
        <IonCard>
            <IonCardHeader>
                Номенклатура найдена
            </IonCardHeader>
            <IonCardTitle> 
                <h4 className="ml-1">
                    { info?.Номенклатура }
                </h4>
            </IonCardTitle>
            <IonCardSubtitle>
                <b className="ml-1">
                { JSON.stringify(info?.ШтрихКоды) }
                </b>
            </IonCardSubtitle>
            <IonCardTitle class="mt-1 ml-1"> 
                <IonRow>
                    <IonCol size="8">{ "Нужное количество: "}</IonCol>
                    <IonCol size="4">{  info?.План }</IonCol>
                </IonRow>
            </IonCardTitle>
            <IonCardTitle class="mt-1 ml-1"> 
            <IonRow>
                <IonCol size="8">{ "Собрано: " }</IonCol>
                <IonCol size="4">{  info?.Факт }</IonCol>
            </IonRow>
            </IonCardTitle>

            <IonToolbar class="w-90 ml-1">
                <IonButton
                    slot = "end"
                    onClick = {()=>{
                        info.Факт = info.План
                        Store.dispatch({type: "sort", sort: 1});
                        props.setModal( false )     
                    }}
                >
                    Собрано
                </IonButton>
            </IonToolbar>

        </IonCard>
    </>
    return elem
}

/////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

function DatetoStr(dat) {
    if(dat !== undefined) {
        let st = dat.substring(0, 10);
        st = st.replace('40', '20').replace('-', '.').replace('-', '.');
        return st
    } else {
        return ""
    }

}

function getNum(num) {
    let st = num
    while(st[0] === '0') {
        st = st.substring(1);
    }
    return st
}
