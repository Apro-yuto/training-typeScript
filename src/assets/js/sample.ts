// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@

// 1, 今の天気をアイコンで表示　OK
// 2, 今日は雨が降るのかを表示。降るのであれば、何時頃か(テキスト)  例) 今日は降らないよ！ 例) 19時頃に雨が降るよ！　OK
// 3, 12時の気温と20時の気温を、「昼」、「夜」と横並びで気温を表示。
// 4, 警報があれば。背景赤で表示。

import axios from "axios";

interface axiosOpt {
  floorLat: number
  floorLong: number
}

interface tempObj {
  day: number;
  eve: number;
  max: number;
  min: number;
  morn: number;
  night: number;
}

interface weatherAPIToday {
  "dt": number,
  "temp": number,
  "num"?: number,
  "feels_like": number,
  "pressure": number,
  "humidity": number,
  "dew_point": number,
  "uvi": number,
  "clouds": number,
  "visibility": number,
  "wind_speed": number,
  "wind_deg": number,
  "wind_gust": number,
  "weather": [
    {
      "id": number,
      "main": string,
      "description": string,
      "icon": string
    }
  ],
  "pop": number
}

class CurrentLocation {
  static getCurrentLocation(): Promise<GeolocationPosition> {
    return new Promise<GeolocationPosition>(
      (
        resolve: (position: GeolocationPosition) => void,
        reject: (positionError: GeolocationPositionError) => void,
      ) => {
        if (!navigator.geolocation) {

          const error: GeolocationPositionError = {
            code: 0,
            message: 'geolocation not supported.',
            PERMISSION_DENIED: 0,
            POSITION_UNAVAILABLE: 0,
            TIMEOUT: 0,
          }
          reject(error);

        }

        const geolocation: Geolocation = navigator.geolocation

        const successCallback: PositionCallback = (position: GeolocationPosition): void => {
          resolve(position)
        }

        const errorCallback: PositionErrorCallback = (positionError: GeolocationPositionError): void => {
          reject(positionError)
        }

        const options: PositionOptions = {
          // enableHighAccuracy: boolean,
          // maximumAge: number,
          // timeout: number,
        }

        geolocation.getCurrentPosition(successCallback, errorCallback, options);
      }
    )
  }
}

const loadDOM: HTMLElement = document.getElementById('load')!;

CurrentLocation.getCurrentLocation().then( result => {
  const floorLat: number = Math.floor(result.coords.latitude)
  const floorLong: number = Math.floor(result.coords.longitude)

  axiosGet('https://api.openweathermap.org/data/2.5/onecall', {floorLat, floorLong})

  loadDOM.style.display = 'none';
}).catch( err => {
  console.log(err)
})

const axiosGet = (url: string, opt:axiosOpt): void=> {
  const APIKEY: string = 'bb0e12659550392b8b3ca22b7089a50f'
  axios.get(`${url}?lat=${opt.floorLat}&lon=${opt.floorLong}&appid=${APIKEY}&units=metric&lang=ja`)
  .then( (res: any) => {

    const currentData: weatherAPIToday = res.data.current;
    const todayHouryData: weatherAPIToday[] = res.data.hourly.slice(0,24);
    const todayData: tempObj = res.data.daily[0].temp

    // 1, 今の天気をアイコンで表示
    inputWeatherIcon(currentData);

    // 2, 今日は雨が降るのかを表示。降るのであれば、何時頃か(テキスト)  例) 今日は降らないよ！ 例) 19時頃に雨が降るよ！
    inputRainyLead(todayHouryData);

    eachTemptoStrings(todayData)

    // 何月何日何時何分の情報かを表示。
    isCurrentDate(currentData.dt)
    console.log({res})

  })
}

// 1, 今の天気をアイコンで表示 -- script

function inputWeatherIcon(currentData: weatherAPIToday): void {
  const sunnyID: number = 800;
  const cloudyID: number = 801;

  let iconPath: string | undefined = undefined;

  if(currentData.weather[0].id === sunnyID) {
    iconPath = 'img_sun.png'
  } else if(currentData.weather[0].id >= cloudyID) {
    iconPath = 'img_cloud.png'
  } else {
    iconPath = 'img_rainy.png'
  }

  inputDOM('weather_icon', `<img src="./assets/img/${iconPath}" alt="${iconPath}">`)
}


// 2, 今日は雨が降るのかを表示。 -- script
function inputRainyLead(todayData: weatherAPIToday[]): void {
  if (!todayData) return;
  const rainyID: number = 622;

  const checkRainy: weatherAPIToday[] = todayData.filter( (data: any, num:number, array: weatherAPIToday[] ) => {
    data['num'] = num
    console.log({data, num, array})
    return data.weather[0].id < rainyID
  } )
  const rainyText =  checkRainy.length > 0 ? `${checkRainy[0].num}時間後に雨が降るよ！` : '今日は雨降らないよ！'

  inputDOM('today', rainyText)
}


// 何月何日何時何分の情報かを表示。
function isCurrentDate(unixTime: number): void {
  const dateTime = new Date( unixTime * 1000 );
  const dateToString = `${ dateTime.toLocaleString('ja-JP')}の情報だよ`

  inputDOM('currentDate', dateToString)
}

// 3, 昼の気温と夜の気温を、「昼」、「夜」と横並びで気温を表示。

function eachTemptoStrings(todaData: tempObj): void {
  const day: number = todaData.day
  const night: number = todaData.night

  const floorDay: number = Math.round(day)
  const floorNight: number = Math.round(night)

  inputDOM('tempDay', `${floorDay}度`)
  inputDOM('tempNight', `${floorNight}度`)
}

// DOM操作
function inputDOM(id: string, inputTxt: string): void {
  if(!id || !inputTxt) return
  const $DOM: HTMLElement = document.getElementById(id)!;
  $DOM.innerHTML = inputTxt;
}


// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@



