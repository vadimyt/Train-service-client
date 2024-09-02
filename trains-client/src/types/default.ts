export interface trainRoutes {
    id: number,
    from_city: string,
    to_city: string,
    from_time: string,
    to_time: string,
    remaining_seats: number,
    cost: number
}

export interface cities {
    id: number,
    name: string
}

export interface tickets {
    train_route: number,
    user: number
}

export interface user {
    pk: number,
    email: string,
    username: string,
    last_name: string,
    first_name: string,
}