// PANELS
const generated = document.getElementById('generated');
const input     = document.getElementById('input');

// BUTTONS 
const point     = document.getElementById('buttonP');
const negate    = document.getElementById('buttonN');
const backspace = document.getElementById('buttonB');
const enter     = document.getElementById('buttonR');
const numbers   = [];
for (let i = 0; i < 10; ++i) {
    numbers.push(document.getElementById(`button${i}`));
}

// VARIABLES
let notFound = false;
let settings = {
    mode: 'multiplication',
    a: {
        type: 'literal',
        value: 0
    },
    b: {
        type: 'literal',
        value: 0
    }
};
let items = {
    a: 0,
    b: 0,
    ax: 0,
    bx: 0
}
let routes = [
    {
        pattern: /M\/(\?+)\/(\d+)/, 
        callback: args => { 
            settings.mode    = 'multiplication';
            settings.a.type  = 'random';
            settings.a.value = args[1].length;
            settings.b.type  = 'literal';
            settings.b.value = Number(args[2]);
        } 
    }, {
        pattern: /M\/(\d+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'multiplication';
            settings.a.type  = 'literal';
            settings.a.value = Number(args[1]);
            settings.b.type  = 'random';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /M\/(\?+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'multiplication';
            settings.a.type  = 'random';
            settings.a.value = args[1].length;
            settings.b.type  = 'random';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /M\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'multiplication';
            settings.a.type  = 'random';
            settings.a.value = args[1].length;
            settings.b.type  = 'random';
            settings.b.value = args[1].length;
        } 
    }
];

function entryPoint() {
    for (let i = 0; i < 10; ++i) {
        const number = numbers[i];
        number.addEventListener('click', ev => {
            if (Number(input.textContent) === 0) {
                input.textContent = i;
            } else {
                input.textContent += i;
            }
        });
    }
    point.addEventListener('click', ev => {
        input.style.color = '#fff';
        if (Number.isInteger(Number(input.textContent)) &&
            input.textContent[input.textContent.length - 1] !== '.') {
            input.textContent += '.';
        }
    });
    negate.addEventListener('click', ev => {
        input.style.color = '#fff';
        input.textContent = -Number(input.textContent);
    });
    backspace.addEventListener('click', ev => {
        input.style.color = '#fff';
        if (String(Math.abs(Number(input.textContent))).length < 2) {
            input.textContent = '0';
            return;
        } else {
            input.textContent = input.textContent.slice(0, -1);
        }
    });
    input.addEventListener('click', ev => {
        input.style.color = '#fff';
        input.textContent = '0';
    });
    generated.addEventListener('click', resetHandler);
    enter.addEventListener('click', enterHandler);
    addEventListener('hashchange', hashChangeHandler);

    hashChangeHandler();
}

function generateRandomNumber(length) {
    const tenth = Math.pow(10, length - 1);
    const total = tenth * 10;

    return Math.floor(Math.random() * (total - tenth) + tenth);
}


function hashChangeHandler(ev) {
    for (let i = 0; i < routes.length; ++i) {
        if (routes[i].pattern.test(location.hash)) {
            routes[i].callback(routes[i].pattern.exec(location.hash));
            notFound = false;
            resetHandler();
            return;
        }
    }
    notFound = true;
}

function generateValues() {
    items.ax = items.a;
    items.bx = items.b;

    if (settings.a.type === 'random') {
        items.a = generateRandomNumber(settings.a.value);
    } else {
        items.b = settings.a.value;
    }
    if (settings.b.type === 'random') {
        items.b = generateRandomNumber(settings.b.value);
    } else {
        items.b = settings.b.value;
    }
}

function resetHandler(ev) {
    input.style.color = '#fff';
    input.textContent = '0';
    const condition = () => (items.a != items.ax && items.b != items.bx) ||
                            (items.a != items.ax && items.b == items.bx) ||
                            (items.a != items.bx && items.b == items.ax) ||
                            (items.b != items.ax && items.a == items.bx) ||
                            (items.b != items.bx && items.a == items.ax);
    let symbol = '';

    if (!notFound) {
        generateValues();
        while (!condition()) {
            generateValues();
        }

        switch(settings.mode) {
            default:
                symbol = '*';
                break;
        }

        generated.textContent = `${items.a} ${symbol} ${items.b}`;
    }
}

function enterHandler(ev) {
    let result = 0;

    switch (settings.mode) {
        default:
            result = items.a * items.b;
            break;
    }

    if (Number(input.textContent) === result) {
        input.style.color = '#0f0';
        setTimeout(resetHandler, 1000);
    } else {
        input.style.color = '#f00';
    }
}

entryPoint();
