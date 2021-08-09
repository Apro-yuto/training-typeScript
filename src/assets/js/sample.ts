// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@

import axios from "axios";

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

interface axiosOpt {
  floorLat: number
  floorLong: number
}

const axiosGet = (url: string, opt:axiosOpt): void=> {
  const APIKEY: string = 'bb0e12659550392b8b3ca22b7089a50f'
  axios.get(`${url}?lat=${opt.floorLat}&lon=${opt.floorLong}&appid=${APIKEY}`)
  .then( (res: any) => {
    console.log({res})
  })
}

// yuto nagashima  @@@@@@ https://github.com/Apro-yuto @@@@@@