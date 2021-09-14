#!/usr/bin/env node
const http = require('http');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const API_KEY = process.env.weatherAPIKey;
const url = `http://api.weatherstack.com/current?access_key=${API_KEY}`;

let query = ''

if(argv._ && argv._.length && argv._[0].length) {
    query = argv._[0];
}

if(!API_KEY) {
    console.log('Не удалось найти API_KEY для получения данных с сервиса погоды');
    return;
}

if(!query) {
    console.log('Не передан город. Укажите город, по которому необходимо узнать погоду');
    return;
}

http.get(createUrl(url, query), (res) => {
    const statusCode = res.statusCode;
    if (statusCode !== 200) {
        console.log('Не удалось получить данные о погоде')
        console.error(`Status Code: ${statusCode}`);
        return;
    }
    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
        let parsedData = JSON.parse(rawData);
        printResult(parsedData);
    });
}).on('error', (e) => {
    console.error(`Получена ошибка: ${e.message}`);
});

function createUrl(url, queryStr) {
    return `${url}&query=${queryStr}`
}

function printResult(data) {
    const result = 
    `   Погода для ${data.location.name}, ${data.location.country || ''}:
        
        температура ${data.current.temperature} С°
        ощущается как ${data.current.feelslike} С°
        влажность ${data.current.humidity} %
        скорость ветра до ${data.current.wind_speed} м/c
        давление ${data.current.pressure} мм.р.ст.
        ${data.current.cloudcover === 0 ? 'облачно' : 'ясно'}
        ${data.current.precip === 0 ? 'без осадков' : 'осадки'}
    `;
    console.log(result);
}