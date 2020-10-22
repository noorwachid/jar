// PANELS
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