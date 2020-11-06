export interface Location {
    name: string;
    label: string;
}

export interface Config {
    url:   {[id: string]: string};
    lang:  string;
    loadingImg: string;
    locations: Location[];
}

export interface MetaData {
    raw: string,
    station: string,
    error: string;
    time: {
        dt: string;
    };
    remarks: string;
    units: {[name: string]: string};
}

export type WeatherData = MetarData | TafData;


export interface MetarData extends MetaData {
    wind_variable_direction: any[];
    runway_visibility: any[];
    temperature: {
        repr: string;
        value: number;
        spoken: string;
    };
    altimeter: {
        repr: string;
        value: number;
        spoken: string;
    };
    clouds: [
        {
            repr: string;
            type: string;
            altitude: number;
            modifier: any;
            direction: any;
        }
    ];
    flight_rules: string;
    other: any[];
    sanitized: string;
    visibility: {
        repr: string;
        value: number;
        spoken: string;
    };
    wind_direction: {
        repr: string;
        value: number;
        spoken: string;
    };
    wind_gust: null;
    wind_speed: {
        repr: string;
        value: number;
        spoken: string;
    };
    wx_codes: [];
    dewpoint: {
        repr: string;
        value: number;
        spoken: string;
    };
    remarks_info: {
        dewpoint_decimal: any;
        temperature_decimal: any;
    };
}

export interface Forecast {
    altimeter: string,
    clouds: [
        {
            repr: string,
            type: string,
            altitude: number,
            modifier: any,
            direction: any
        }
    ],
    flight_rules: string,
    other: any[],
    sanitized: string,
    visibility: {
        repr: string,
        value: number,
        spoken: string
    },
    wind_direction: {
        repr: string,
        value: number,
        spoken: string
    },
    wind_gust: null,
    wind_speed: {
        repr: string,
        value: number,
        spoken: string
    },
    wx_codes: any[],
    end_time: {
        repr: string,
        dt: string
    },
    icing: any[],
    raw: string,
    start_time: {
        repr: string,
        dt: string
    },
    turbulence: any[],
    type: string,
    summary: string
}


export interface TafData extends MetaData  {
    forecast: Forecast[];
    start_time: {
        repr: string,
        dt: string
    },
    end_time: {
        repr: string,
        dt: string
    },
    max_temp: string,
    min_temp: string,
    alts: any,
    temps: any,
}