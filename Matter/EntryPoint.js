const distanceErrorAllowed = 0.05;

let items = {
    a: 0,
    b: 0,
    ax: 0,
    bx: 0,
    result: 0,
    factors: [], 
    multiplicants: [],
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
        generatedL.textContent = 'A is lesser than B';
        settings.shutdown = true;
        return;
    }
    settings.shutdown = false;
}

function ResetBasic() {
    inputL.style.color = '#333';
    inputL.textContent = '0';
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

        generatedL.textContent = `${items.a} ${symbol} ${items.b}`;
        if (settings.v) {
            inputL.textContent = items.result;
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
    generatedL.textContent = `${items.a} − ${items.b}`;
    items.result = items.a - items.b;
    if (settings.v) {
        inputL.textContent = items.result;
    }
}

function InitializePerfectDivision() {
    if (settings.a.length < settings.b.length) {
        generatedL.textContent = 'A is lesser than B';
        settings.shutdown = true;
        return;
    }
    
    if (settings.a.type === 'L' && settings.b.type === 'R') {
        if (settings.a.value === 1) {
            generatedL.textContent = 'A is one';
            settings.shutdown = true;
        }
        if (IsPrimeNumber(settings.a.value)) {
            generatedL.textContent = 'A is a prime number';
            settings.shutdown = true;
            return;
        }
        items.factors = GetFactors(settings.a.value)
            .filter(item => String(item).length === settings.b.length);
        return;
    }
    if (settings.a.type === 'R' && settings.b.type === 'L') {
        items.multiplicants = GetMultiplicants(settings.b.value, settings.a.length);
        return;
    }

    settings.shutdown = false;
}

function ResetPerfectDivision() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

    if (settings.shutdown) {
        return;
    }

    if (settings.a.type === 'L' && settings.b.type === 'R') {
        items.a = settings.a.value;
        items.b = GetRandomItem(items.factors);
    } else if (settings.a.type === 'R' && settings.b.type === 'L') {
        items.a = GetRandomItem(items.multiplicants);
        items.b = settings.b.value;
    } else {
        items.b = GetRandomNumber(settings.b.length);
        items.a = GetRandomItem(GetMultiplicants(items.b, settings.a.length));
    }

    generatedL.textContent = `${items.a} / ${items.b}`;
}

function ResetSquareBased() {
    inputL.style.color = '#333';
    inputL.textContent = '0';

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
            generatedL.textContent = `${items.a}²`;
            items.result = items.a ** 2;
            break;
        case 'R':
        case 'O':
            generatedL.textContent = `√${items.a}`;
            items.result = Math.sqrt(items.a);
            break;
    }
    if (settings.v) {
        inputL.textContent = items.result;
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
    if (cond) {
        inputL.style.color = '#2a2';
        setTimeout(settings.Reset, 600);
    } else {
        inputL.style.color = '#f22';
    }
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

function GetMultiplicants(number, length) {
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
