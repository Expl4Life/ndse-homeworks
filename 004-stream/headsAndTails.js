#!/usr/bin/env node

const readline = require('readline');
const input = readline.createInterface(process.stdin);
const path = require('path');
const fs = require('fs');
const yargs = require('yargs/yargs');
const util = require('util');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const MIN = 1; // орёл
const MAX = 2; // решка
const LOG_DIR_NAME = 'logs';
const JSON_EXTENSION = '.json';
const RESULT_NAMES = {
    [MIN]: 'орёл',
    [MAX]: 'решка',
}
const randomNumber = getRandomInt(MIN, MAX);
let logFileName = ''

if(argv._ && argv._.length && argv._[0].length) {
    logFileName = `${argv._[0]}${JSON_EXTENSION}`;
}

const filePath = path.join(__dirname, LOG_DIR_NAME, logFileName);
const dirPath = path.join(__dirname, LOG_DIR_NAME);

class Logger {
    constructor(filePath, dirPath) {
        this.filePath = filePath;
        this.dirPath = dirPath;
        this.isFolderCreated = false
        this.logWasRead = false;
        this.data = {
            results: [],
        };
    }

    init() {
       this._createLogFolder();
    }

    writeLog = (obj) => {
        if(!this.isFolderCreated) {
            input.close();
            return;
        }

        const data = {
            ...this.data,
            results: (Array.isArray(this.data.results) && this.logWasRead) ? [...this.data.results, obj] : [] 
        }

        writeFile(this.filePath, JSON.stringify(data, null, 4))
            .catch((err) => {
                if (err) throw new Error(err);
            })
            .finally(() => input.close())
    }

    _createLogFolder = () => {
        fs.mkdir(this.dirPath, { recursive: true }, async (err) => {
            if (err) throw new Error(err);
            this.isFolderCreated = true;
            this._readLogFile();
        });
    }

    _readLogFile = () => {
        this.isFolderCreated && 
            readFile(this.filePath, 'utf-8')
                .then((data) => {
                    this.data = JSON.parse(data);
                    this.logWasRead = true;
                })
                .catch((err) => {
                    if (err) {
                        this.logWasRead = false;
                    }
                })
    }
}

console.log(`
    Сыграем в игру "Орёл или решка"!  Введите числа 1 (орел) или 2 (решка), чтобы угадать
`);

input.on('line', guessPlayHandler);
input.on('close', () => {
    console.log('Конец игры');
    process.exit(0);
});

if(!logFileName) {
    return;
}

const logger = new Logger(filePath, dirPath);
logger.init();

function guessPlayHandler(data) {
    const value = parseInt(data);
    const isWinner = value === randomNumber;
    
    if (value !== MIN && value !== MAX) {
        console.log(`Неверное значение, введите число 1 или 2`);
        return;
    }

    isWinner 
        ? console.log(`Вы угадали, это действительно ${RESULT_NAMES[randomNumber]} (${randomNumber})`) 
        : console.log(`Вы не угадали, правильный ответ - ${RESULT_NAMES[randomNumber]} (${randomNumber})`);

    const result = { isWinner, date: new Date().toISOString() };
    logFileName && logger.writeLog(result);
}

function getRandomInt(minVal, maxVal) {
    const min = Math.ceil(minVal);
    const max = Math.floor(maxVal);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

