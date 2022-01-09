import React from 'react';

export const convertKelvinToC = (temp: string) => {
    return Math.trunc(parseInt(temp) - 273.15)
}