#!/usr/bin/env node

const readline = require('readline');
const input = readline.createInterface(process.stdin);
const MIN = 0;
const MAX = 100;

console.log(`Загадано число в диапазоне от ${MIN} до ${MAX}`);
const randomNumber = getRandomInt(MIN, MAX);

input.on('line', guessPlayHandler);
input.on('close', () => console.log('This is the end'));

function guessPlayHandler(data) {
     const value = Number(data);

    if (isNaN(parseFloat(data))) {
        console.log(`Введенное значение ${data} не является числом, введите число`);
        return;
    }

    if (value === randomNumber) {
        console.log(`Отгадано число ${randomNumber}`);
        process.exit(0);
    }

    if (value < randomNumber) {
        console.log('Больше');
        return;
    }

    if (value > randomNumber) {
        console.log('Меньше');
        return;
    }
}

function getRandomInt(minVal, maxVal) {
    const min = Math.ceil(minVal);
    const max = Math.floor(maxVal);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
