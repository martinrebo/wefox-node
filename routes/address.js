var express = require('express');
var router = express.Router();
const dotenv = require("dotenv").config();
const fetch = require('node-fetch');


/* Add an endpoint that receives an address and validate if its valid. This address must be in an
object with the properties street, streetNumber, town, postalCode and country. */
router.post('/validate', function (req, res, next) {

  let address = encodeURIComponent(req.body.address)

  const geoAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GEO_API_KEY}`


  const validateAddress = async url => {

    try {
      const response = await fetch(url)
      const json = await response.json()
      res.json(json)
    }
    catch (error) {
      res.send(error)
    }
  }

  validateAddress(geoAPI)

});

/* 
Add an endpoint that receives an address and check the weather at the latitude and
longitude of that address.
*/
router.post('/weather', function (req, res, next) {

  let lat = parseInt(req.body.lat)
  let lon = parseInt(req.body.lon)
  let weatherAPI_URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`

  const getWeather = async url => {
    try {
      const response = await fetch(url)
      const json = await response.json()
      res.json(json)
    }
    catch (error) {
      res.send(error)
    }
  }

  getWeather(weatherAPI_URL)

});

/* Add an endpoint that receives an address, validate it and check the weather for the lat/lon of
that address.*/

router.post('/checker', function (req, res, next) {


  let address = encodeURIComponent(req.body.address)

  const geoAPI = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GEO_API_KEY}`

  const validateAddress = async url => {
    try {
      const response = await fetch(url)
      const json = await response.json()
      return json.results[0].geometry.location
    }
    catch (error) {
      res.send(error)
    }
  }

  validateAddress(geoAPI)
    .then(coordinates => {
      console.log(coordinates)
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&appid=${process.env.WEATHER_API_KEY}`)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          res.send(data)
        })
    })
})


module.exports = router;
