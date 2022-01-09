import React from "react";
import axios from "axios";
import { citiesArray } from "../constant";

export async function apiGetCities(citiesId:string[]){

    var data = JSON.stringify({
        query: `query {
        getCityById(id:${JSON.stringify(citiesId)},config:{lang:sp}) {
          id
          name
          country
          weather{
            summary{
              icon
              description
            }
            clouds {
              humidity
              visibility
            }
            temperature{
              actual
              feelsLike
              min
              max
            }
            wind {
              speed
            }
          }
        }
      }`,
        variables: {}
      });
      
      return axios({
        method: 'post',
        url: 'https://graphql-weather-api.herokuapp.com/',
        headers: { 
          'Accept-Encoding': 'gzip, deflate, br', 
          'Content-Type': 'application/json', 
          'Accept': 'application/json', 
          'Connection': 'keep-alive', 
          'DNT': '1', 
          'Origin': 'https://graphql-weather-api.herokuapp.com'
        },
        data : data
      })
      .then(function (response) {
        return {error:false, data:response.data};
      })
      .catch(function (error) {
        console.log(error);
        return {error:true, data:error};
      });
}



export async function apiGetCitiesByName(cityName:string){

  var data = JSON.stringify({
      query: `query {
        getCityByName(name:"Cordoba",config:{lang:sp}) {
        id
        name
        country
        weather{
          summary{
            icon
            description
          }
          clouds {
            humidity
            visibility
          }
          temperature{
            actual
            feelsLike
            min
            max
          }
          wind {
            speed
          }
        }
      }
    }`,
      variables: {}
    });
    
    return axios({
      method: 'post',
      url: 'https://graphql-weather-api.herokuapp.com/',
      headers: { 
        'Accept-Encoding': 'gzip, deflate, br', 
        'Content-Type': 'application/json', 
        'Accept': 'application/json', 
        'Connection': 'keep-alive', 
        'DNT': '1', 
        'Origin': 'https://graphql-weather-api.herokuapp.com'
      },
      data : data
    })
    .then(function (response) {
      return {error:false, data:response.data};
    })
    .catch(function (error) {
      return {error:true, data:error};
    });
}