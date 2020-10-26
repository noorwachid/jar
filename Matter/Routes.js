// A      != add 
// M      != multiply
// S      != substract
// U      ?= perfect substract
// D      == divide
// I      == perfect divide
// Q      != square
// R      != square root
// O      != perfect square root
// \?+    the length of random number (R)
// [0-9]+ literal number (L)
//
// != implemented
// ?= kind of implemented
// == unimplemented

let settings = {
    mode: 'M',
    reset: () => {},
    check: () => {},
    a: {
        type: 'L',
        value: 0
    },
    b: {
        type: 'L',
        value: 0
    }
};

let routeNotFound = false;
let routes = [
    {
        pattern: /M\/(\?+)\/(\d+)/, 
        callback: args => { 
            settings.mode    = 'M';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'L';
            settings.b.value = Number(args[2]);
        } 
    }, {
        pattern: /M\/(\d+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'M';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'L';
            settings.a.value = Number(args[1]);
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /M\/(\?+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'M';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        }
    }, {
        pattern: /M\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'M';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[1].length;
        } 
    }, {
        pattern: /Q\/(\?+)/,
        callback: args => {
            settings.mode    = 'Q';
            settings.reset   = resetSquareBased;
            settings.check   = checkSquareBased;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
        }
    }, {
        pattern: /R\/(\?+)/,
        callback: args => {
            settings.mode    = 'R';
            settings.reset   = resetSquareBased;
            settings.check   = checkSquareBased;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
        }
    }, {
        pattern: /O\/(\?+)/,
        callback: args => {
            settings.mode    = 'O';
            settings.reset   = resetSquareBased;
            settings.check   = checkSquareBased;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
        }
    }, {
        pattern: /A\/(\?+)\/(\d+)/, 
        callback: args => { 
            settings.mode    = 'A';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'L';
            settings.b.value = Number(args[2]);
        } 
    }, {
        pattern: /A\/(\d+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'A';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'L';
            settings.a.value = Number(args[1]);
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /A\/(\?+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'A';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        }
    }, {
        pattern: /A\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'A';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[1].length;
        } 
    }, {
        pattern: /S\/(\?+)\/(\d+)/, 
        callback: args => { 
            settings.mode    = 'S';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'L';
            settings.b.value = Number(args[2]);
        } 
    }, {
        pattern: /S\/(\d+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'S';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'L';
            settings.a.value = Number(args[1]);
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /S\/(\?+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'S';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        }
    }, {
        pattern: /S\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'S';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[1].length;
        } 
    }, {
        pattern: /U\/(\?+)\/(\d+)/, 
        callback: args => { 
            settings.mode    = 'U';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'L';
            settings.b.value = Number(args[2]);
        } 
    }, {
        pattern: /U\/(\d+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'U';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'L';
            settings.a.value = Number(args[1]);
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        } 
    }, {
        pattern: /U\/(\?+)\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'U';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[2].length;
        }
    }, {
        pattern: /U\/(\?+)/, 
        callback: args => { 
            settings.mode    = 'U';
            settings.reset   = reset;
            settings.check   = check;
            settings.a.type  = 'R';
            settings.a.value = args[1].length;
            settings.b.type  = 'R';
            settings.b.value = args[1].length;
        } 
    }
];