let settings = {
    mode: 'M',
    Initialize: function() {},
    Reset: function() {},
    check: function() {},
    shutdown: false,
    a: {
        type: 'L',
        value: 0,
        length: 0
    },
    b: {
        type: 'L',
        value: 0,
        length: 0
    },
    v: false,
};

function SetSettings(mode, initCallback, resetCallback, checkCallback, typeA, valueA, typeB, valueB) {

    function SetItem(item, type, value) {
        if (type === 'R') {
            item.value = 0;
        } else {
            item.value = Number(value);
        }
        item.length = value.length;
    }

    if (typeB === undefined) {
        typeB = typeA;
        valueB = valueA;
    } 

    settings.mode = mode;
    settings.Initialize = initCallback;
    settings.Reset = resetCallback;
    settings.check = checkCallback;
    settings.a.type = typeA;
    settings.b.type = typeB;
    SetItem(settings.a, typeA, valueA);
    SetItem(settings.b, typeB, valueB);
}

let routeNotFound = false;
let routes = [
    {
        pattern: /M\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('M', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /M\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('M', InitializeBasic, ResetBasic, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /M\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('M', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /M\/(\?+)/, 
        callback: args => { 
            SetSettings('M', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /A\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('A', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /A\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('A', InitializeBasic, ResetBasic, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /A\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('A', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /A\/(\?+)/, 
        callback: args => { 
            SetSettings('A', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /S\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('S', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /S\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('S', InitializeBasic, ResetBasic, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /S\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('S', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /S\/(\?+)/, 
        callback: args => { 
            SetSettings('S', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /Sx\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('Sx', InitializeBasic, ResetPerfectSubstraction, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /Sx\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('Sx', InitializeBasic, ResetPerfectSubstraction, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /Sx\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('Sx', InitializeBasic, ResetPerfectSubstraction, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /Sx\/(\?+)/, 
        callback: args => { 
            SetSettings('Sx', InitializeBasic, ResetPerfectSubstraction, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /D\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('D', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /D\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('D', InitializeBasic, ResetBasic, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /D\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('D', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /D\/(\?+)/, 
        callback: args => { 
            SetSettings('D', InitializeBasic, ResetBasic, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /Dx\/(\?+)\/(\d+)/, 
        callback: args => { 
            SetSettings('Dx', InitializePerfectDivision, ResetPerfectDivision, CheckBasic, 'R', args[1], 'L', args[2]);
        } 
    }, {
        pattern: /Dx\/(\d+)\/(\?+)/, 
        callback: args => { 
            SetSettings('Dx', InitializePerfectDivision, ResetPerfectDivision, CheckBasic, 'L', args[1], 'R', args[2]);
        } 
    }, {
        pattern: /Dx\/(\?+)\/(\?+)/, 
        callback: args => { 
            SetSettings('Dx', InitializePerfectDivision, ResetPerfectDivision, CheckBasic, 'R', args[1], 'R', args[2]);
        }
    }, {
        pattern: /Dx\/(\?+)/, 
        callback: args => { 
            SetSettings('Dx', InitializePerfectDivision, ResetPerfectDivision, CheckBasic, 'R', args[1]);
        } 
    }, {
        pattern: /Q\/(\?+)/,
        callback: args => {
            SetSettings('Q', InitializeBasic, ResetSquareBased, CheckSquareBased, 'R', args[1]);
        }
    }, {
        pattern: /R\/(\?+)/,
        callback: args => {
            SetSettings('R', InitializeBasic, ResetSquareBased, CheckSquareBased, 'R', args[1]);
        }
    }, {
        pattern: /Rx\/(\?+)/,
        callback: args => {
            SetSettings('Rx', InitializeBasic, ResetSquareBased, CheckSquareBased, 'R', args[1]);
        }
    }
];
