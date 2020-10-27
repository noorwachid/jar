function KeyDownHandler(event) {
    if (event.key === ' ') {
        event.preventDefault();
        ResetHandler();
        return;
    }
    
    for (let i = 0; i < 10; ++i) {
        if (event.key == i) {
            NumberHandler(i);
            return;
        }
    }

    switch (event.key) {
        case '.':
            PointHandler();
            break;
        case 'Backspace':
            BackspaceHandler();
            break;
        case '-':
            NegateHandler();
            break;
        case 'Enter':
            EnterHandler();
            break;
        case 'Delete':
            ClearHandler();
            break;
    }
}


function NumberHandler(number) {
    inputL.style.color = '#333';
    if (inputL.textContent === '0') {
        inputL.textContent = number;
    } else {
        inputL.textContent += number;
    }
}

function PointHandler() {
    function HasPoint(text) {
        for (let i = 0; i < text.length; ++i) {
            if (text[i] === '.') {
                return true;
            }
        }
        return false;
    }
    inputL.style.color = '#333';
    if (!HasPoint(inputL.textContent)) {
        inputL.textContent += '.';
    }
}
function NegateHandler() {
    inputL.style.color = '#333';
    inputL.textContent = -Number(inputL.textContent);
}
function BackspaceHandler() {
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
function ClearHandler() {
    inputL.style.color = '#333';
    inputL.textContent = '0';
}

function HashChangeHandler() {
    if (/V/.test(location.hash)) {
        settings.v = true;
    }
    for (let i = 0; i < routes.length; ++i) {
        if (routes[i].pattern.test(location.hash)) {
            routes[i].callback(routes[i].pattern.exec(location.hash));
            routeNotFound = false;
            items.a = 0;
            items.ax = 0;
            items.b = 0;
            items.bx = 0;
            items.result = 0;
            items.factors = [];
            items.products = [];
            settings.Initialize();
            settings.Reset();
            return;
        }
    }
    routeNotFound = true;
    generatedL.textContent = 'Unknown route';
}

function ResetHandler() {
    settings.Reset();
}

function EnterHandler() {
    settings.Check();
}
