let strings = {
    generators:{
        "H2FuelCell":"Hydrogen Fuel Cell",
        "UraniumReactor":"Uranium Reactor",
        "FussionReactor":"Deuterium Fussion Reactor",
        "H2FussionReactor":"Hydrogen Fussion Reactor",
        "SolarPanel":"Solar Panel",
    },
    gasses: {
        "N2":"Nitrogen",
        "H2":"Hydrogen",
        "O2":"Oxygen",
        "He":"Helium",
    },
    keys:["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","R","Q","S","T","U","V","W","X","Y","Z"],
    keybinds: {
        "KeyA":"A",
        "KeyD":"D",
        "KeyW":"W",
        "KeyS":"S",
        "Digit1":"1",
        "Digit2":"2",
        "Digit3":"3",
        "Digit4":"4",
        "Digit5":"5",
        "Digit6":"6",
        "Digit7":"7",
        "Digit8":"8",
        "Digit9":"9",
        "Digit0":"0",
        "ShiftLeft":"Shift",
        "ControlLeft":"Ctrl",
        "Tab":"Tab",
    }
}

for (let i = 0; i<strings.keys.length; i++) {
    strings.keybinds["Key"+strings.keys[i]] = strings.keys[i]
}