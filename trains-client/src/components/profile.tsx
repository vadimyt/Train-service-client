import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { cities, tickets, trainRoutes } from "../types/default";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import Cookies from 'js-cookie';
import { toIsoString } from "./trains";


const mapState = (state: RootState) => (
    {
        user: state.userData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const profile: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const navigate = useNavigate();
    const [trainRoutes, setTrainRoutes] = useState<trainRoutes[]>([]);
    const getTickets = () => {
        axios.get("http://127.0.0.1:8000/api/tickets", {
            withCredentials: true
        }).then((res) => {
            console.log("Server response: ", res);
            (res.data).map((train_route:trainRoutes)=>{
                setTrainRoutes(old => [...old, { id: train_route.id, from_city: train_route.from_city, to_city: train_route.to_city, from_time: train_route.from_time, to_time: train_route.to_time, remaining_seats: train_route.remaining_seats, cost: train_route.cost }])
            })
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    const getTrainRoute = (id:number) => {
        axios.get("http://127.0.0.1:8000/api/train_routes/"+id, {
            withCredentials: true
        }).then((res) => {
            console.log("Server response: ", res);
            setTrainRoutes(old => [...old, { id: res.data.id, from_city: res.data.from_city, to_city: res.data.to_city, from_time: res.data.from_time, to_time: res.data.to_time, remaining_seats: res.data.remaining_seats, cost: res.data.cost }])
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    const del = (id:number) => {
        axios.delete("http://127.0.0.1:8000/api/tickets/"+id, {
            withCredentials: true
        }).then((res) => {
            console.log("Server response: ", res);
            setTrainRoutes(trainRoutes.filter(train_route => train_route.id != id))
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    useEffect(() => {
        getTickets()
    }, [])
    return (
        <div>
            <button onClick={()=>navigate("/trains")}>trains</button>
            <div>Мои билеты
                <div>
                {trainRoutes.length == 0 ? <>Не найдено путей</> :
                    <> {trainRoutes.map((trainRoute) => {
                        return (
                            <>
                                <div>
                                    Путь
                                </div>
                                <div>
                                    <label>{trainRoute.from_city}</label>
                                    <label> -&gt; </label>
                                    <label>{trainRoute.to_city}</label>
                                    <label> отбытие: </label>
                                    <label>{toIsoString(new Date(trainRoute.from_time))}</label>
                                    <label> прибытие: </label>
                                    <label>{toIsoString(new Date(trainRoute.to_time))}</label>
                                    <label> кол-во свободных мест: </label>
                                    <label>{trainRoute.remaining_seats}</label>
                                    <label> цена: </label>
                                    <label>{trainRoute.cost / 100}</label>
                                </div>
                                <div>
                                    <button onClick={()=>del(trainRoute.id)}>Удалить</button>
                                </div>
                            </>
                        )
                    })}
                    </>}
                </div>
            </div>
        </div>
    )
}

export default connector(profile)