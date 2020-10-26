
let items = {
    a: 0,
    b: 0,
    ax: 0,
    bx: 0
}

function entryPoint() {
    for (let i = 0; i < 10; ++i) {
        numbersL[i].addEventListener('click', numberHandler);
    }
    pointL.addEventListener('click', pointHandler);
    negateL.addEventListener('click', negateHandler);
    backspaceL.addEventListener('click', backspaceHandler);
    inputL.addEventListener('click', clearHandler);
    generatedL.addEventListener('click', resetHandler);
    enterL.addEventListener('click', enterHandler);
    addEventListener('hashchange', hashChangeHandler);
    hashChangeHandler();
}

function numberHandler(ev) {
    const number = Number(ev.target.textContent);

    inputL.style.color = '#333';
    if (inputL.textContent === '0') {
        inputL.textContent = number;
    } else {
        inputL.textContent += number;
    }
}
function pointHandler(ev) {
    function hasPoint(text) {
        for (let i = 0; i < text.length; ++i) {
            if (text[i] === '.') {
                return true;
            }
        }
        return false;
    }
    inputL.style.color = '#333';
    if (!hasPoint(inputL.textContent)) {
        inputL.textContent += '.';
    }
}
function negateHandler(ev) {
    inputL.style.color = '#333';
    inputL.textContent = -Number(inputL.textContent);
}
function backspaceHandler(ev) {
    inputL.style.color = '#333';
    if (inputL.textContent[inputL.textContent.length - 1] === '.') {
        inputL.textContent = inputL.textContent.slice(0, -1);
    } else if (String(Math.abs(Number(inputL.textContent))).length === 1) {
        inputL.textContent = '0';
        return;
    } else {
        inputL.textContent = inputL.textContent.slice(0, -1);
    }
}
function clearHandler(ev) {
    inputL.style.color = '#333';
    inputL.textContent = '0';
}

function generateFixedLengthNumber(length) {
    const tenth = Math.pow(10, length - 1);
    const total = tenth * 10;

    return Math.floor(Math.random() * (total - tenth) + tenth);
}

function hashChangeHandler(ev) {
    for (let i = 0; i < routes.length; ++i) {
        if (routes[i].pattern.test(location.hash)) {
            routes[i].callback(routes[i].pattern.exec(location.hash));
            routeNotFound = false;
            resetHandler();
            return;
        }
    }
    routeNotFound = true;
}

function generateValues() {
    items.ax = items.a;
    items.bx = items.b;

    if (settings.a.type === 'R') {
        items.a = generateFixedLengthNumber(settings.a.value);
    } else {
        items.a = settings.a.value;
    }
    if (settings.b.type === 'R') {
        items.b = generateFixedLengthNumber(settings.b.value);
    } else {
        items.b = settings.b.value;
    }
}

function resetHandler(ev) {
    settings.reset();
}

function enterHandler(ev) {
    settings.check();
}

function isPermutionPreviousPair() {
    return (items.a != items.ax && items.b != items.bx) ||
        (items.a != items.ax && items.b == items.bx) ||
        (items.a != items.bx && items.b == items.ax) ||
        (items.b != items.ax && items.a == items.bx) ||
        (items.b != items.bx && items.a == items.ax);
}

function reset() {
    inputL.style.color = '#333';
    inputL.textContent = '0';
    let symbol = '';

    if (!routeNotFound) {
        generateValues();
        while (!isPermutionPreviousPair()) {
            generateValues();
        }

        switch(settings.mode) {
            case 'A':
                symbol = '+';
                break;
            case 'S':
                symbol = '−';
                break;
            case 'U':
                symbol = '−';
                if (items.a < items.b) {
                    const temp = items.a;
                    items.a = items.b;
                    items.b = temp;
                }
                break;
            default:
                symbol = '×';
                break;
        }

        generatedL.textContent = `${items.a} ${symbol} ${items.b}`;
    }
}

function check() {
    let result = 0;

    switch (settings.mode) {
        case 'A':
            result = items.a + items.b;
            break;
        case 'S':
            result = items.a - items.b;
            break;
        default:
            result = items.a * items.b;
            break;
    }

    if (Number(inputL.textContent) === result) {
        inputL.style.color = '#2a2';
        setTimeout(settings.reset, 1000);
    } else {
        inputL.style.color = '#f22';
    }
}

function resetSquareBased() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

    function generate() {
        items.ax = items.a;
        items.a = settings.mode === 'O' 
            ? generatePerfectSquare(settings.a.value)
            : generateFixedLengthNumber(settings.a.value);
    }
    generate();
    while (items.a === items.ax) {
        generate();
    }

    switch (settings.mode) {
        case 'Q':
            generatedL.textContent = `${items.a}²`;
            break;
        case 'R':
        case 'O':
            generatedL.textContent = `√${items.a}`;
            break;
    }
}

function checkSquareBased() {
    const userInput = Number(inputL.textContent);

    switch (settings.mode) {
        case 'Q':
            checkUserInput(userInput === items.a ** 2);
            break;
        case 'R':
            checkUserInput(Math.abs(userInput - Math.sqrt(items.a)) < 0.05);
            break;
        case 'O':
            checkUserInput(userInput === Math.sqrt(items.a));
            break;
    }
}

function checkUserInput(cond) {
    if (cond) {
        inputL.style.color = '#2a2';
        setTimeout(settings.reset, 600);
    } else {
        inputL.style.color = '#f22';
    }
}

entryPoint();

function generatePerfectSquare(length) {
    const remainder = length % 2;
    const diviant = Math.floor(length / 2);
    const length2 = remainder + diviant;
    const limit1 = 0.316 * (10 ** length2);
    const limit2 = 0.999 * (10 ** length2);
    let target = generateFixedLengthNumber(length2);

    if (remainder === 1) {
        while (target > limit1) {
            target = generateFixedLengthNumber(length2);
        }
    } else {
        while (target < limit1 || target > limit2) {
            target = generateFixedLengthNumber(length2);
        }
    }
    return target ** 2;
}