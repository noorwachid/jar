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
    items.a = 0;
    items.ax = 0;
    items.b = 0;
    items.bx = 0;
    items.result = 0;
    items.factors = [];
    items.products = [];
    items.inputs = [];
    items.time = 0;
    items.limit = 0;
    settings.time = 0;
    settings.limit = 0;

    subtitleL.textContent = '';

    beginSceneL.hidden = false;
    mainSceneL.hidden = true;
    endSceneL.hidden = true;

    const vPattern = /V/;
    const timePattern = /T\/(\d+):?(\d+)?/;
    const limitPattern = /L\/(\d+)/;
    if (vPattern.test(location.hash)) {
        settings.v = true;
    }
    if (limitPattern.test(location.hash)) {
        const results = limitPattern.exec(location.hash);
        settings.limit = Number(results[1]);
        subtitleL.textContent += `
            ${settings.limit} question${settings.limit > 1 ? 's' : ''} · 
        `;
    }
    if (timePattern.test(location.hash)) {
        const results = timePattern.exec(location.hash);
        if (results[2]) {
            settings.time = (Number(results[1]) * 60) + Number(results[2]);
        } else {
            settings.time = Number(results[1]);
        }
        subtitleL.textContent += `${SecondsToString(settings.time)} · `;
    }

    for (let i = 0; i < routes.length; ++i) {
        if (routes[i].pattern.test(location.hash)) {
            routes[i].callback(routes[i].pattern.exec(location.hash));
            routeNotFound = false;

            settings.Initialize();
            settings.Reset();
            return;
        }
    }
    routeNotFound = true;
    titleL.textContent = 'Error';
    subtitleL.textContent = 'Unknown route';
    startButtonL.hidden = true;
}

function ResetHandler() {

    settings.Reset();
}

function EnterHandler() {
    settings.Check();
}
