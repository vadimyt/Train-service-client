import axios, { AxiosError } from "axios";
import { FC, useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { cities, trainRoutes } from "../types/default";
import Select from 'react-select'
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css'
import { RootState } from "../store";
import { connect, ConnectedProps } from "react-redux";
import Cookies from 'js-cookie';

export interface options {
    value: number,
    label: string
}

export function toIsoString(date : Date) {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num: number) {
            return (num < 10 ? '0' : '') + num;
        };
  
    return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(Math.floor(Math.abs(tzo) / 60)) +
        ':' + pad(Math.abs(tzo) % 60);
}

const mapState = (state: RootState) => (
    {
        user: state.userData
    }
)

type PropsFromRedux = ConnectedProps<typeof connector>

const connector = connect(mapState)

const trains: FC<PropsFromRedux> = (props: PropsFromRedux) => {
    const navigate = useNavigate();
    const [trainRoutes, setTrainRoutes] = useState<trainRoutes[]>([]);
    const [citiesOptions, setCitiesOptions] = useState<options[]>([]);
    const [fromCity, setFromCity] = useState<number>();
    const [toCity, setToCity] = useState<number>();
    const [date, setDate] = useState<Date | null>(null);
    const today = new Date()
    const getTrainRoutes = () => {
        axios.get("http://127.0.0.1:8000/api/train_routes" + "?from_city=" + fromCity + "&to_city=" + toCity + "&from_time=" + new Date(date!.getTime() - date!.getTimezoneOffset() * 60000)?.toISOString(), {
            withCredentials: true
        }).then((res) => {
            console.log("Server response: ", res);
            setTrainRoutes(res.data)
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    const getCities = () => {
        axios.get("http://127.0.0.1:8000/api/cities", {
            withCredentials: true
        }).then((res) => {
            console.log("Server response: ", res);
            (res.data as cities[]).map((city) => {
                setCitiesOptions(old => [...old, { value: city.id, label: city.name }])
            }
            )
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    const buy = (id:number) => {
        axios.post("http://127.0.0.1:8000/api/tickets", {
            train_route: id,
            user: props.user.pk,
            withCredentials: true,
        }).then((res) => {
            console.log("Server response: ", res);
        }).catch((err: AxiosError) => {
            console.log("Server respondend with error: ", err);
        })
    }
    useEffect(() => {
        getCities()
    }, [])
    useEffect(() => {
        if (fromCity != null && toCity != null && date != null)
            getTrainRoutes()
    }, [fromCity, toCity, date])
    return (
        <div>
            <div>
                <button onClick={() => navigate("/profile")}>My account</button>
            </div>
            <Select onChange={(e) => setFromCity(e?.value)} options={citiesOptions} />
            <Select onChange={(e) => setToCity(e?.value)} options={citiesOptions} />
            <div>
                <DatePicker dateFormat='dd/MM/YYYY' selected={date} onChange={(newValue) => setDate(newValue)} />
            </div>
            {fromCity != null && toCity != null && date != null ? <div className="trainRoutes">
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
                                    <button onClick={()=>buy(trainRoute.id)}>Купить</button>
                                </div>
                            </>
                        )
                    })}
                    </>}
            </div> : <></>}

        </div>
    )
}

export default connector(trains)