let size_plateau = 0;
let default_color = '#7f8c8d';
let tolal_flow = 0;
let tolal_hit = 0;
let plateau = [];
let boat = {
    'porte-avions': {
        'name': 'A',
        'size': 5,
        'direction': 'N',
        'color': '#3498db',
        'hit': 0,
        'isFlow': false
    },
    'croiseur': {
        'name': 'B',
        'size': 4,
        'direction': 'N',
        'color': '#2ecc71',
        'hit': 0,
        'isFlow': false
    },
    'contre-torpilleur': {
        'name': 'C',
        'size': 3,
        'direction': 'N',
        'color': '#e74c3c',
        'hit': 0,
        'isFlow': false
    },
    'sous-marin': {
        'name': 'D',
        'size': 3,
        'direction': 'N',
        'color': '#8e44ad',
        'hit': 0,
        'isFlow': false
    },
    'torpilleur': {
        'name': 'E',
        'size': 2,
        'direction': 'N',
        'color': '#d35400',
        'hit': 0,
        'isFlow': false
    },
};

setGameInfos();

function generateBoats {
    generateBoat('porte-avions');
    generateBoat('croiseur');
    generateBoat('contre-torpilleur');
    generateBoat('sous-marin');
    generateBoat('torpilleur');
    generateGrid();
}

/**
 *
 * @param type
 */
function generateBoat(type) {
    if (boat[type]) boat[type].direction = getBoatDirection();
    let direction = boat[type].direction;
    let size = boat[type].size;
    let success = false;
    let state = 0;
    let tour = 0;

    while (!success) {
        let startLimite = Math.floor(Math.random() * (size_plateau - size));
        let start = Math.floor(Math.random() * size_plateau);

        if (direction === 'V') {
            success = placeBoat(startLimite, start, true, boat[type].name, size);
        } else {
            success = placeBoat(start, startLimite, false, boat[type].name, size);
        }
        tour++;
        if (tour >= 20 && state === 0) {
            tour = 0;
            state = 1;
        } else if (tour >= 20 && state === 1) {
            tour = 0;
            state = 2;
            if (direction === "H") {
                boat[type].direction = "V";
                direction = "V";
            } else {
                boat[type].direction = "H";
                direction = "H";
            }
        } else if (tour >= 20 && state === 2) {
            alertMessage("Impossible de placer les Bateaux, veuillez reéssayer !", 'danger');
            break;
        }
    }
}

function placeBoat(l, c, direction, name, size) {
    let directionLine;
    let directionCol;
    let success = true;

    if (direction) {
        directionLine = 1;
        directionCol = 0;
    } else {
        directionLine = 0;
        directionCol = 1;
    }
    for (let i = 0; i < size; i++) {
        if (plateau[l + i * directionLine][c + i * directionCol] && plateau[l + i * directionLine][c + i * directionCol] !== 0) {
            success = false;
            break;
        }
    }
    if (success) {
        for (let i = 0; i < size; i++) {
            plateau[l + i * directionLine][c + i * directionCol] = name;
        }
    }
    return success;
}

function getBoatDirection() {
    let rand_direction = parseInt(getRandomCases(1, 2));
    if (rand_direction === 1) return 'H';
    return 'V';
}

function setGameInfos() {
    let chose_col = prompt('Taille du jeu (min 10 - max 15) :');
    if (chose_col >= 10 && chose_col <= 15) {
        if (chose_col != null) {
            size_plateau = parseInt(chose_col);
        }
        let isGood = verifyGameInfos();
        if (isGood) {
            generatePlateau();
        } else {
            setGameInfos();
        }
    } else {
        setGameInfos();
    }
}

function verifyGameInfos() {
    let calc = size_plateau * size_plateau;
    if (calc >= 100) {
        return true;
    }
    return false;
}

function generatePlateau() {
    for (let i = 0; i < size_plateau; i++) {
        plateau[i] = [];
        for (let j = 0; j < size_plateau; j++) {
            plateau[i][j] = 0;
        }
    }
    generateBoats();
}

function generateGrid() {
    let grid = "<div class='grid mt-5' ><table border='1' class='table grid_table '>";
    grid += '<tr>';
    grid += '<td class=\'grid_elements\'></td>';
    for (let i = 0; i < size_plateau; i++) {
        grid += '<td class=\'grid_elements\'>' + (i + 1) + '</td>';
    }
    grid += "</tr>";
    for (let i = 0; i < size_plateau; i++) {
        grid += '<tr>';
        grid += '<td class=\'grid_elements\'>' + (i + 1) + '</td>';
        for (let k = 0; k < size_plateau; k++) {
            let td = "<td class='grid_elements grid_elements_case' id='grid_" + i + "_" + k + "'>.</td>";
            grid += (td);
        }
        grid += "</tr>";
    }
    grid += "</table></div>";
    document.getElementById('batailleNavale').innerHTML = document.getElementById('batailleNavale').innerHTML + grid;

}

function getRandomCases(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeCase(element, element_id, boatName) {
    let target = boat[boatName];
    element.classList.add('checked');
    document.getElementById(element_id).style.backgroundColor = target.color;
    document.getElementById(element_id).style.color = '#ffffff';
    element.innerText = target.name;
    if (target.hit + 1 >= target.size) {
        target.hit = target.size;
        target.isFlow = true;
        tolal_flow++;
        tolal_hit++;
        alertMessage("\"Bien joué vous avez coulé un navire ennemi !", 'success');
        checkWin();
    } else {
        target.hit++;
        tolal_hit++;
        alertMessage("Bien joué vous avez touché un navire ennemi", 'success');
    }
}

function getBoatName(result) {
    switch (result) {
        case 'A':
            return "porte-avions";
            break;
        case 'B':
            return "croiseur";
            break;
        case 'C':
            return "contre-torpilleur";
            break;
        case 'D':
            return "sous-marin";
            break;
        case 'E':
            return "torpilleur";
            break;
    }
}

function onClickCase(event) {
    event.preventDefault();
    const element = this;
    let element_id = element.id;
    let element_class = element.classList;
    let split_coord = element_id.split("_");

    let col_target = split_coord[2];
    let line_target = split_coord[1];

    if (tolal_flow < 5) {
        if (!element_class.contains('checked')) {
            if (plateau[line_target][col_target] !== 0) {
                let boatName = getBoatName(plateau[line_target][col_target]);
                changeCase(element, element_id, boatName);
            } else {
                element.classList.add('checked');
                document.getElementById(element_id).style.backgroundColor = default_color;
                document.getElementById(element_id).style.color = '#ffffff';
                element.innerText = 'X';
                tolal_hit++;
                alertMessage("Dommage c'est dans l'eau !", 'warning');
            }
        } else {
            alertMessage("Vous avez déjà cliqué sur cette case !", 'danger');
        }
    } else {
        alertMessage("Vous avez gagné la partie, ça ne sert à rien d'utiliser plus de munitions !", 'danger');
    }
}

function checkWin() {
    if (tolal_flow >= 5) alertMessage("Vous avez gagné la partie en " + tolal_hit + " coups ! Bien joué ! :D", 'success');
}

function alertMessage(message, type) {
    let msg = "<div class='alert alert-" + type + " alert-dismissible fade show' role='alert'> " + message + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span> </button> </div>";
    document.getElementById('alertMessageGame').innerHTML = msg + document.getElementById('alertMessageGame').innerHTML;
}

function alertMessageAuto(message, type) {

}

document.querySelectorAll('td.grid_elements_case').forEach(function (link) {
    link.addEventListener('click', onClickCase);
});