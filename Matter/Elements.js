// SCENES
const beginSceneL = document.getElementById('begin-scene');
const endSceneL   = document.getElementById('end-scene');
const mainSceneL  = document.getElementById('main-scene');

// PANELS
const infoL      = document.getElementById('info');
const generatedL = document.getElementById('generated');
const inputL     = document.getElementById('input');

// BUTTONS 
const pointL     = document.getElementById('buttonP');
const negateL    = document.getElementById('buttonN');
const backspaceL = document.getElementById('buttonB');
const enterL     = document.getElementById('buttonR');
const numbersL   = [];
for (let i = 0; i < 10; ++i) {
    numbersL.push(document.getElementById(`button${i}`));
}

const titleL    = document.getElementById('title');
const subtitleL = document.getElementById('subtitle');
const scoreL    = document.getElementById('score');
const subscoreL = document.getElementById('subscore');
const listL     = document.getElementById('list');

const startButtonL   = document.getElementById('start-button');
const restartButtonL = document.getElementById('restart-button');
