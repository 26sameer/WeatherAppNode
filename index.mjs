import http from 'http'
import fs from 'fs'
import requests from 'requests'

const htmlFile = fs.readFileSync('./index.html', 'utf-8')

const replaceValue = (tempVal, ogVal) => {
  if (ogVal.cod == 404) {
    let error = `<h1 style="display:flex; align-items:center; height:90%; justify-content:center;">City Not Found</h1>`
    return error
  } else {
    let temperature = tempVal.replace('{%temperature%}', ogVal.main.temp)
    temperature = temperature.replace('{%pressure%}', ogVal.main.pressure)
    temperature = temperature.replace('{%humidity%}', ogVal.main.humidity)
    temperature = temperature.replace('{%wind-speed%}', ogVal.wind.speed)
    temperature = temperature.replace('{%city%}', ogVal.name)
    temperature = temperature.replace('{%country%}', ogVal.sys.country)
    temperature = temperature.replace('{%weather%}', ogVal.weather[0].main)
    temperature = temperature.replace('{%desc%}', ogVal.weather[0].description)
    if (ogVal.weather[0].main == 'Clouds') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-cloudy-2-line"></i>')
    } else if (ogVal.weather[0].main == 'Clear') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-sun-cloudy-line"></i>')
    } else if (ogVal.weather[0].main == 'Mist') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-mist-line"></i>')
    } else if (ogVal.weather[0].main == 'Haze') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-haze-line"></i>')
    } else if (ogVal.weather[0].main == 'Rain') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-showers-line"></i>')
    } else if (ogVal.weather[0].main == 'Snowy' || ogVal.weather[0].main == 'Snow') {
      temperature = temperature.replace('{%icon%}', '<i class="ri-snowy-line"></i>')
    }

    return temperature
  }
}

const server = http.createServer((req, res) => {
  if (req.url == '/') {
    requests('https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=ef6f14c9ad488ecc1894ae0f690fac5d&units=metric')
      .on('data', (chunk) => {
        const objData = JSON.parse(chunk)
        const arrData = [objData]
        const realTimeData = arrData.map((val) => replaceValue(htmlFile, val)).join('')
        res.write(realTimeData)
      })
      .on('end', (err) => {
        if (err) return console.log('connection closed due to errors', err)
        res.end()
      })
  } else {
    res.end('PAGE NOT FOUND')
  }
})

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening at port 8000')
})
