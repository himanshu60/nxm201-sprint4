const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser")
const { connection } = require("./config/db")
const { userRouter } = require("./routes/user.route")
const https = require("https")
const { authmiddleware } = require("./middleware/authenticate")
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json())
app.use(cookieParser())

app.use(bodyParser.urlencoded({ extended: true }));


app.get("/weather", authmiddleware, (req, res) => {
    res.send("Welcome to weather app")
})

app.use("/user", userRouter)


// weather app
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")

})

app.post("/", authmiddleware,(req, res) => {
    const query = req.body.cityName
    const apiKey = "93f2eaad7733d65ea7833208ee588cfe"
    const weatherurl = 'https://api.openweathermap.org/data/2.5/weather?q=' + query + '&appid=' + apiKey

    https.get(weatherurl, (response) => {
        response.on("data", (data) => {
            const weatherData = JSON.parse(data);
            console.log(weatherData)
            const temperature = weatherData.main.temperature;
            const details = weatherData.weather[0].details
            // console.log(discription)
            res.send(`City temperature in ${query} is ${temperature} degree celcius \n And weather data is ${details}`)
        })
    })
    
})

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log(`connected to port at ${process.env.port}`)
    } catch (error) {
        console.log(error)
    }
})
