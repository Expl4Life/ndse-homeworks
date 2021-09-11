#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const util = require('util');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const readFile = util.promisify(fs.readFile);
const LOG_DIR_NAME = 'logs';
const JSON_EXTENSION = '.json';

let logFileName = ''

if(argv._ && argv._.length && argv._[0].length) {
    logFileName = `${argv._[0]}${JSON_EXTENSION}`;
}

const filePath = path.join(__dirname, LOG_DIR_NAME, logFileName);

if(!logFileName) {
    console.log('Не передам путь к файлу логов, укажите имя файла');
    return;
}

console.log('Идет чтение..');
readFile(filePath, 'utf-8')
    .then((data) => {
        console.log('готово!')
        let parsedData = JSON.parse(data);
        printData(parsedData.results);
    })
    .catch((err) => {
        if (err) {
            console.log('Не удась прочитать файл, просьба ввести корректное название файла')
        }
    })


function printData(data) {
    if(!Array.isArray(data)) {
        console.log('Недопустимый формат вывода данных');
        return;
    }
    // * общее количество партий; 
    // * количество выигранных / проигранных партий;
    // * процентное соотношение выигранных партий.
    const totalCount = data.length;
    const totalWin = data.filter(item  => item.isWinner).length;
    const lostGames = totalCount - totalWin;

    console.log(`

        * общее количество партий : ${totalCount}
        * количество выигранных / проигранных партий : ${totalWin + '/'+ lostGames}
        * процентное соотношение выигранных партий : ${(totalWin / totalCount) * 100}
        
    `)
}
