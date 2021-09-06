#!/usr/bin/env node
const yargs = require('yargs');

const COMMANDS = {
    current: 'current',
    add: 'add',
    sub: 'sub',
}

const ALIASES = {
    year: 'year',
    month: 'month',
    date: 'date'
}

const OPTIONS = {
    y: 'y',
    m: 'm',
    d: 'd'
}

yargs
    .command({
        command: COMMANDS.current,
        describe: `display the ${COMMANDS.current} date/year/month`,
        handler: currentTimeHandler,
        builder: (yargs) => yargs
            .option(OPTIONS.m, { alias: ALIASES.month, describe: 'display the current month', type: 'boolean',})
            .option(OPTIONS.d, { alias: ALIASES.date, describe: 'display the current date', type: 'boolean'})
            .option(OPTIONS.y, { alias: ALIASES.year, describe: 'display the current year', type: 'boolean' })
    })
    .example(`cmd ${COMMANDS.current}`)
    .example(`cmd ${COMMANDS.current} --year or cmd ${COMMANDS.current} -y`)
    .example(`cmd ${COMMANDS.current} --month or cmd ${COMMANDS.current} -m`)
    .example(`cmd ${COMMANDS.current} --date or cmd ${COMMANDS.current} -d`)

yargs
    .command({
        command: COMMANDS.add,
        describe: 'add some date/year/month to current ISO time',
        handler: addTimeHandler,
        builder: (yargs) => yargs
            .option(OPTIONS.m, { alias: ALIASES.month, describe: 'add some month to current ISO time', type: 'number',})
            .option(OPTIONS.d, { alias: ALIASES.date, describe: 'add some days to current ISO time', type: 'number'})
            .option(OPTIONS.y, { alias: ALIASES.year, describe: 'add some years to current ISO time', type: 'number' })
    })
    .example(`cmd ${COMMANDS.add} -d 2 - ISO date and time in two days forward`)

yargs
    .command({
        command: COMMANDS.sub,
        describe: 'subtract some date/year/month from current ISO time',
        handler: subTimeHandler,
        builder: (yargs) => yargs
            .option(OPTIONS.m, { alias: ALIASES.month, describe: 'subtract some month from current ISO time', type: 'number',})
            .option(OPTIONS.d, { alias: ALIASES.date, describe: 'subtract some date from current ISO time', type: 'number'})
            .option(OPTIONS.y, { alias: ALIASES.year, describe: 'subtract some year from current ISO time', type: 'number' })
    })
    .example(`cmd ${COMMANDS.sub} --month 1 (ISO date and time in one month backward)`)

// base helper / usage describer
yargs
    .usage(`
        Usage: cmd <command>
        where <command> is one of: ${Object.keys(COMMANDS).join(', ')}  
    `)
    .showHelpOnFail(true)
    .help(
        'help',
        'Show usage instructions'
    )
    .fail((msg) => {
        console.error(msg);
        yargs.showHelp();
    })
    .command({
        command: '*',
        handler() {
            yargs.showHelp()
        },
    })  
    .demandCommand()
    .epilog(`copyright Witcher(c) ${new Date().getFullYear()}`)
    .argv

// handlers
function currentTimeHandler(argv) {
    const currentDate = new Date();
    const { month, year, date } = useBooleanOptionCatcher(argv);

    // RESULT OUTPUT
    month && console.log(currentDate.getMonth());
    year && console.log(currentDate.getFullYear());
    date && console.log(currentDate.getDate());

    if(!month && !date && !year) {
        console.log(currentDate);
    }
}

function addTimeHandler(argv) {
    const currentDate = new Date();
    const { month, year, date } = useNumberOptionCatcher(argv);

    // RESULT OUTPUT
    month && console.log(addOrSubMonths(currentDate, month));
    year && console.log(addOrSubYears(currentDate, year));
    date && console.log(addOrSubDays(currentDate, date));

    if(!month && !date && !year) {
        console.log(currentDate);
    }
}

function subTimeHandler(argv) {
    const currentDate = new Date();
    const { month, year, date } = useNumberOptionCatcher(argv);

    // RESULT OUTPUT
    month && console.log(addOrSubMonths(currentDate, -month));
    year && console.log(addOrSubYears(currentDate, -year));
    date && console.log(addOrSubDays(currentDate, -date));

    if(!month && !date && !year) {
        console.log(currentDate);
    }
}

// utils
function useBooleanOptionCatcher(argv = {}) {
    return {
        [ALIASES.month]: Boolean(argv[OPTIONS.m]) ||  false,
        [ALIASES.year]: Boolean(argv[OPTIONS.y]) ||  false,
        [ALIASES.date]: Boolean(argv[OPTIONS.d]) || false,
    }
}

function useNumberOptionCatcher(argv = {}) {
    return {
        [ALIASES.month]: argv[OPTIONS.m] || 0,
        [ALIASES.year]: argv[OPTIONS.y] || 0,
        [ALIASES.date]: argv[OPTIONS.d] || 0,
    }
}

function addOrSubMonths(date, months) {
    var d = date.getDate();
    date.setMonth(date.getMonth() + months);
    if (date.getDate() != d) {
      date.setDate(0);
    }
    return date;
}

function addOrSubYears(date, years) {
    const time = date.getTime();
    return new Date(time + (1000 * 60 * 60 * 24 * (leapYear(date.getFullYear()) ? 366 : 365))  * years);
}

function addOrSubDays(date, days) {
    const time = date.getTime();
    return new Date(time + (1000 * 60 * 60 * 24 * days));
}

function leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
}
