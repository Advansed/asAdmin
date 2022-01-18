import { combineReducers  } from 'redux'
import axios from 'axios'
import { Reducer } from 'react';
import { SQLiteJSWrapper } from 'sqlite-js-wrapper'

var reducers: Array<Reducer<any, any>>;reducers = []

export const i_state = {

    auth:                        false,
    route:                          "",
    login:                          {
        name: "", guid: "", image: ""},
    orders:                         [],
    order:                          "",
    goods:                          "",  
    param:                          "",
    barcode:                        "",   
    sort:                            0,  
    mode:                           {
        mode: "place",
        params: [{key: "q", value: "62.0275204, 129.7125726"}]
    },  
    points:                         [
        {Адрес: "Первый адрес", lat: 62.0275204, lng: 129.7322226, Выбран: false },
        {Адрес: "Второй адрес", lat: 62.0341504, lng: 129.7285466, Выбран: false},
        {Адрес: "Третий адрес", lat: 62.0224574, lng: 129.7124426, Выбран: false},
        {Адрес: "Четверный адрес", lat: 62.0225204, lng: 129.7165726, Выбран: false},
    ],
}


for(const [key, value] of Object.entries(i_state)){
    reducers.push(
        function (state = i_state[key], action) {
            switch(action.type){
                case key: {
                    if(typeof(value) === "object"){
                        if(Array.isArray(value)) {
                            return action[key]
                        } else {
                            let data: object; data = {};
                            for(const key1 of Object.keys(value)){ 
                                data[key1] = action[key1] === undefined ? state[key1] : action[key1]
                            }   
                            return data
                        }

                    } else return action[key]
                }
                default: return state;
            }       
        }

    )
}


export async function   getData(method : string, params){

    let res = await axios.post(
            URL + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}


export async function   getData1C(method : string, params){

    let res = await axios.post(
            URL1C + method, params
    ).then(response => response.data)
        .then((data) => {
            if(data.Код === 200) console.log(data) 
            return data
        }).catch(error => {
          console.log(error)
          return {Код: 200}
        })
    return res

}


function                create_Store(reducer, initialState) {
    var currentReducer = reducer;
    var currentState = initialState;
    var listeners: Array<any>; listeners = []
    return {
        getState() {
            return currentState;
        },
        dispatch(action) {
            currentState = currentReducer(currentState, action);
            listeners.forEach((elem)=>{
                if(elem.type === action.type){
                    elem.func();
                }
            })
            return action;
        },
        subscribe(listen: any) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === listen.num; 
            });
            if(ind >= 0){
                listeners[ind] = listen;
            }else{
                listeners = [...listeners, listen]
            }
        },
        unSubscribe(index) {
            var ind = listeners.findIndex(function(b) { 
                return b.num === index; 
            });
            if(ind >= 0){
                listeners.splice(ind, 1)
            }        
        }
    };
}

const                   rootReducer = combineReducers({

    auth:                   reducers[0],
    route:                  reducers[1],
    login:                  reducers[2],
    orders:                 reducers[3],  
    order:                  reducers[4],    
    goods:                  reducers[5],
    param:                  reducers[6],   
    barcode:                reducers[7],  
    sort:                   reducers[8],
    mode:                   reducers[9], 
    points:                 reducers[10],  
            
})

export const Store   =  create_Store(rootReducer, i_state)

export const URL1C = "https://marketac.ru:49002/ut/hs/API/V1/"

export const URL = "https://marketac.ru:49002/node/"

export async function   getDatas(){
}

export function Phone(phone): string {
    if(phone === undefined) return ""
    if(phone === null) return ""
    let str = "+"
    for(let i = 0;i < phone.length;i++){
      let ch = phone.charCodeAt(i)
      if( ch >= 48 && ch <= 57) str = str + phone.charAt(i)
    }
    return str
}

export async function getProfile(phone){
    Store.dispatch({type: "auth", auth: true });
    let res = await getData("method", {
            method: "Профиль",
            phone:  Phone(phone),
        })
    let login = res[0];login.type = "login"
    Store.dispatch( login )
}

export async function Check(good){
    let res = await getData("method", {method: "Товар", Код: good.Код})
    if(res.length > 0)  return res[0]
    else return {"Код": good.Код, "Количество": 0 }
}

let timerId;


export async function   getOrders(){
    Orders();
    timerId = setInterval(() => {
        Orders()        
    }, 5000);
  
}


export async function          Orders(){
    let res = await getData1C("ЛистСборки", {
        ГУИД:   Store.getState().login.guid
    })   
    let jarr: any = [];
    let jrr: any = [];
    res.forEach(e => {
        if( e.Выбран ) jrr = [e]
        else jarr = [...jarr, e]
    });
    Store.dispatch({type: "orders", orders: jarr})
    if(jrr.length > 0)
        Store.dispatch({type: "order", order: jrr[0]})
    
}


export function         stopOrders(){

  //    setTimeout(() => { clearInterval(timerId) });

}


async function          exec(){


}

Store.subscribe({num: 101, type: "login", func: ()=>{
    Orders();
}})

//exec();
