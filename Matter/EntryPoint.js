const distanceErrorAllowed = 0.05;
let beginTimePoint = 0;
let timerIntervalId = 0;
let generated = '';

let items = {
    a: 0,
    b: 0,
    ax: 0,
    bx: 0,
    result: 0,
    factors: [], 
    products: [],
    inputs: [],
    time: 0,
    limit: 0,
}

function EntryPoint() {
    for (let i = 0; i < 10; ++i) {
        numbersL[i].addEventListener('click', ev => {
            NumberHandler(i);
        });
    }
    pointL.addEventListener('click', PointHandler);
    negateL.addEventListener('click', NegateHandler);
    backspaceL.addEventListener('click', BackspaceHandler);
    inputL.addEventListener('click', ClearHandler);
    generatedL.addEventListener('click', ResetHandler);
    enterL.addEventListener('click', EnterHandler);
    addEventListener('hashchange', HashChangeHandler);
    addEventListener('keydown', KeyDownHandler);
    startButtonL.addEventListener('click', ev => {
        beginSceneL.hidden = true;
        mainSceneL.hidden = false;
        endSceneL.hidden = true;
        beginTimePoint = performance.now();
        if (settings.time > 0) {
            items.time = settings.time;
            UpdateInfo();
            --items.time;
            timerIntervalId = setInterval(() => {
                UpdateInfo();
                --items.time;
                if (items.time < 0) {
                    clearInterval(intervalId);
                    settings.Check();
                    ShowScore();
                }
            }, 1000);
        }
    });
    restartButtonL.addEventListener('click', HashChangeHandler);
    HashChangeHandler();
}

function FillItems() {
    items.ax = items.a;
    items.bx = items.b;

    if (settings.a.type === 'R') {
        items.a = GetRandomNumber(settings.a.length);
    } else {
        items.a = settings.a.value;
    }
    if (settings.b.type === 'R') {
        items.b = GetRandomNumber(settings.b.length);
    } else {
        items.b = settings.b.value;
    }
}

function SwapItems() {
    const temp = items.a;
    items.a = items.b;
    items.b = temp;
}

function IsPreviousPair() {
    return items.a === items.ax && items.b === items.bx;
}

function IsPermutionOfPreviousPair() {
    return (items.a != items.ax && items.b != items.bx) ||
        (items.a != items.ax && items.b == items.bx) ||
        (items.a != items.bx && items.b == items.ax) ||
        (items.b != items.ax && items.a == items.bx) ||
        (items.b != items.bx && items.a == items.ax);
}

function InitializeBasic() {
    if (settings.mode === 'Sx' && (settings.a.length < settings.b.length)) {
        titleL.textContent = 'Error';
        subtitleL.textContent = 'A is lesser than B';
        startButtonL.hidden = true;
        settings.shutdown = true;
        return;
    }
    settings.shutdown = false;
    
    switch (settings.mode) {
        case 'A':
            titleL.textContent = 'Addition';
            break;
        case 'M':
            titleL.textContent = 'Multiplication';
            break;
        case 'S':
        case 'Sx':
            titleL.textContent = 'Substraction';
            break;
        case 'D':
            titleL.textContent = 'Division';
            break;
    }

    subtitleL.textContent += `
        ${settings.a.length} digit${settings.a.length > 1 ? 's' : ''}
        by ${settings.b.length} digit${settings.b.length > 1 ? 's' : ''}
    `;
    if (settings.mode == 'Sx') {
        subtitleL.textContent += ' · non negative result';
    }
}

function ResetBasic() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

    items.limit += 1;
    UpdateInfo();

    let symbol = '';

    if (settings.shutdown) {
        return;
    }

    if (!routeNotFound) {
        FillItems();
        if (settings.mode === 'S' || settings.mode === 'D') {
            while (IsPreviousPair()) {
                FillItems();
            }
        } else {
            while (!IsPermutionOfPreviousPair()) {
                FillItems();
            }
        }

        switch(settings.mode) {
            case 'A':
                symbol = '+';
                items.result = items.a + items.b;
                break;
            case 'M':
                symbol = '×';
                items.result = items.a * items.b;
                break;
            case 'S':
                symbol = '−';
                items.result = items.a - items.b;
                break;
            case 'D':
                symbol = '/';
                items.result = items.a / items.b;
                break;
        }

        generated = `${items.a} ${symbol} ${items.b}`;
        generatedL.textContent = generated;
        if (settings.v) {
            inputL.textContent = settings.mode === 'D' 
                ? items.result.toFixed(2)
                : items.result;
        }
    }
}

function CheckBasic() {
    const userInput = Number(inputL.textContent);

    switch (settings.mode) {
        case 'A':
            CheckUserInput(items.result === userInput);
            break;
        case 'M':
            CheckUserInput(items.result === userInput);
            break;
        case 'S':
        case 'Sx':
            CheckUserInput(items.result === userInput);
            break;
        case 'D':
            CheckUserInput(Math.abs(items.result - userInput) < distanceErrorAllowed);
            break;
        case 'Dx':
            CheckUserInput(items.result === userInput);
    }
}

function ResetPerfectSubstraction() {   
    inputL.style.color = '#333';
    inputL.textContent = '0';

    items.limit += 1;
    UpdateInfo();

    if (settings.shutdown) {
        return;
    }

    if (settings.a.type === 'L' && settings.b.type === 'R') {
        items.a = settings.a.value;
        items.b = GetRandomNumber(settings.b.length);
        while (IsPreviousPair() || items.a < items.b) {
            items.b = GetRandomNumber(settings.b.length);
        }
    } else if (settings.a.type === 'R' && settings.b.type === 'L') {
        items.a = GetRandomNumber(settings.a.length);
        items.b = settings.b.value;
        while (IsPreviousPair() || items.a < items.b) {
            items.a = GetRandomNumber(settings.a.length);
        }
    } else {
        FillItems();
        if (items.a < items.b) {
            SwapItems();
        }
        while (IsPreviousPair()) {
            FillItems();
            if (items.a < items.b) {
                SwapItems();
            }
        }
    }
    generated = `${items.a} − ${items.b}`;
    generatedL.textContent = generated;
    items.result = items.a - items.b;
    if (settings.v) {
        inputL.textContent = items.result;
    }
}

function InitializePerfectDivision() {
    if (settings.a.length < settings.b.length) {
        titleL.textContent = 'Error';
        subtitleL.textContent = 'A is lesser than B';
        startButtonL.hidden = true;
        settings.shutdown = true;
        return;
    }
    
    if (settings.a.type === 'L' && settings.b.type === 'R') {
        if (settings.a.value === 1) {
            titleL.textContent = 'Error';
            subtitleL.textContent = 'A is one';
            startButtonL.hidden = true;
            settings.shutdown = true;
        }
        if (IsPrimeNumber(settings.a.value)) {
            titleL.textContent = 'Error';
            subtitleL.textContent = 'A is a prime number';
            startButtonL.hidden = true;
            settings.shutdown = true;
            return;
        }
        items.factors = GetFactors(settings.a.value)
            .filter(item => String(item).length === settings.b.length);
        return;
    }
    if (settings.a.type === 'R' && settings.b.type === 'L') {
        items.products = GetProducts(settings.b.value, settings.a.length);
        return;
    }

    settings.shutdown = false;
    titleL.textContent = 'Division';
    subtitleL.textContent += `
        ${settings.a.length} digit${settings.a.length > 1 ? 's' : ''}
        by
        ${settings.b.length} digit${settings.b.length > 1 ? 's' : ''}
        · non fraction result
    `;
}

function ResetPerfectDivision() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

    items.limit += 1;
    UpdateInfo();

    items.ax = items.a;
    items.bx = items.b;
    
    if (settings.shutdown) {
        return;
    }

    let lonely = false;

    if (settings.a.type === 'L' && settings.b.type === 'R') {
        items.a = settings.a.value;
        items.b = GetRandomItem(items.factors);
    } else if (settings.a.type === 'R' && settings.b.type === 'L') {
        items.a = GetRandomItem(items.products);
        items.b = settings.b.value;
        if (items.products.length === 1) {
            lonely = true;
        } 
    } else {
        items.b = GetRandomNumber(settings.b.length);
        items.a = GetRandomItem(GetProducts(items.b, settings.a.length));
    }

    if (!lonely && IsPreviousPair()) {
        ResetPerfectDivision();
    }

    generated = `${items.a} / ${items.b}`;
    generatedL.textContent = generated;
    items.result = items.a / items.b;
    if (settings.v) {
        inputL.textContent = items.result;
    }
}

function InitializeSquareBased() {
    switch (settings.mode) {
        case 'Q':
            titleL.textContent = 'Square';
            break;
        case 'R':
        case 'Rx':
            titleL.textContent = 'Square Root';
            break;
    }
    subtitleL.textContent += `
        ${settings.a.length} digit${settings.a.length > 1 ? 's' : ''}
    `;
    if (settings.mode === 'Rx') {
        subtitleL.textContent += ' · non fraction result';
    }
}

function ResetSquareBased() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

    items.limit += 1;
    UpdateInfo();

    function Generate() {
        items.ax = items.a;
        items.a = settings.mode === 'O' 
            ? GetPerfectSquaredNumber(settings.a.length)
            : GetRandomNumber(settings.a.length);
    }
    Generate();
    while (items.a === items.ax) {
        Generate();
    }

    switch (settings.mode) {
        case 'Q':
            generated = `${items.a}²`;
            items.result = items.a ** 2;
            break;
        case 'R':
        case 'O':
            generated = `√${items.a}`;
            items.result = Math.sqrt(items.a);
            break;
    }
    generatedL.textContent = generated;
    if (settings.v) {
        inputL.textContent = settings.mode === 'R' 
            ? items.result.toFixed(2)
            : items.result;
    }
}

function CheckSquareBased() {
    const userInput = Number(inputL.textContent);

    switch (settings.mode) {
        case 'Q':
            CheckUserInput(userInput === items.result);
            break;
        case 'R':
            CheckUserInput(Math.abs(userInput - items.result) < distanceErrorAllowed);
            break;
        case 'O':
            CheckUserInput(userInput === items.result);
            break;
    }
}

function CheckUserInput(cond) {
    if (settings.limit > 0 || settings.time > 0) {
        items.inputs.push([generated, inputL.textContent, cond]);
        if (settings.limit > 0 && items.limit >= settings.limit) {
            if (settings.time > 0) {
                clearInterval(timerIntervalId);
            }
            ShowScore();
            return;
        }
        settings.Reset();
        return;
    }

    if (cond) {
        inputL.style.color = '#2a2';
        setTimeout(settings.Reset, 600);
        return;
    }
    inputL.style.color = '#f22';
}

function GetPerfectSquaredNumber(length) {
    const remainder = length % 2;
    const diviant = Math.floor(length / 2);
    const length2 = remainder + diviant;
    const limit1 = 0.316 * (10 ** length2);
    const limit2 = 0.999 * (10 ** length2);
    let target = GetRandomNumber(length2);

    if (remainder === 1) {
        while (target > limit1) {
            target = GetRandomNumber(length2);
        }
    } else {
        while (target < limit1 || target > limit2) {
            target = GetRandomNumber(length2);
        }
    }
    return target ** 2;
}

function IsPrimeNumber(number) {
    const squareRootNumber = Math.sqrt(number);
    for (let i = 2; i <= squareRootNumber; ++i) {
        if (number % i === 0) {
            return false;
        }
    }
    return number > 1;
}

function GetFactors(number) {
    let list = [];
    for (let i = 1; i <= number; ++i) {
        if (number % i === 0) {
            list.push(i);
        }
    }
    return list;
}

function GetProducts(number, length = 1) {
    let result = 1;
    let list = [];
    const max = 10 ** length;

    for (let i = 1; result < max; ++i) {
        result = i * number;
        if (String(result).length === length) {
            list.push(result);
        }
    }
    return list;
}

function GetRandomNumber(length) {
    const tenth = Math.pow(10, length - 1);
    const total = tenth * 10;

    return Math.floor(Math.random() * (total - tenth) + tenth);
}

function GetRandomItem(list) {
    return list[Math.floor(Math.random() * list.length)];
}

function ShowScore() {
    beginSceneL.hidden = true;
    mainSceneL.hidden = true;
    endSceneL.hidden = false;

    const timePassed = Math.floor((performance.now() - beginTimePoint) / 1000);
    const correctAnswers = items.inputs.filter(item => item[2]).length;
    

    scoreL.textContent = `
        ${(correctAnswers / items.limit * 100).toFixed(2)}%
    `;
    subscoreL.textContent = `
        ${correctAnswers} out of ${items.limit} question${items.limit > 1 ? 's' : ''} ·
        in ${SecondsToString(timePassed)}
    `;
    
    listL.innerHTML = '';
    for (let i = 0; i < items.inputs.length; ++i) {
        let item = items.inputs[i];
        listL.innerHTML += `<div${!item[2] ? ' class="wrong"' : ''}>${item[0]} = ${item[1]}</div>`;
    }
}

function SecondsToString(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    let str = '';
    if (m > 0) {
        str += `${m} minute`;
        if (m > 1) {
            str += 's';
        }
        str += ' ';
    }
    str += `${s} second`;
    if (s > 1) {
        str += 's';
    }
    return str;
}

function SecondsToClock(seconds) {
    const s = seconds % 60;
    let str = Math.floor(seconds / 60);
    str += ':';
    str += s < 10 ? `0${s}` : s;
    return str;
}

function UpdateInfo() {
    infoL.textContent = '';
    if (settings.limit > 0) {
        infoL.textContent += `${items.limit}/${settings.limit} `;
    }
    if (settings.time > 0) {
        infoL.textContent += `${SecondsToClock(items.time)}`;        
    }
}
