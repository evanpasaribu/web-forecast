import express from "express";
import axios from "axios";
import bodyParser from 'body-parser'; 


const app = express()
const port = 3000
    
app.use(bodyParser.urlencoded({ extended: true }));

const config = {
    params: { 
        appid: "633baa94823f1c6af0c4d6d0db514605",
        units: 'metric'
     }
  };


app.use(express.static("public"))

app.get('/', async (req, res) => {
    res.render('index.ejs')
})


app.post('/', async (req, res) => {
    const city = req.body.city;
    console.log(`City received: ${city}`);  
    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}`,config)
        const result2 = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}`,config)
        const lat = result.data.coord.lat;
        const lon = result.data.coord.lon;
        const time = await axios.get(`https://timeapi.io/api/Time/current/coordinate?latitude=${lat}&longitude=${lon}`)
        console.log(time.data);
        const location = lat + ", " + lon ;
        console.log(location)
        res.render("index.ejs", {
            weather :  result.data ,
            forecast : result2.data ,
            map : location,
            lat: lat,
            lon: lon,
            currentHour : time.data
        })
    } catch (error) {
        console.log(`error: ${error}`);
        res.render('index.ejs', { weather: null, forecast: null, map: null, lat: null, lon: null });
    }
})

app.listen(port, ()=> {
    console.log(`server is running on port : ${port}`)
})