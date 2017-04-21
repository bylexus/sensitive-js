export const centerGameObjects = (objects) => {
    objects.forEach(function(object) {
        object.anchor.setTo(0.5);
    });
};

export const centerSpriteOnPoint = (sprite, x, y) => {
    let newX = Math.floor(x-sprite.width / 2);
    let newY = Math.floor(y-sprite.height / 2);
    if (sprite.body) {
        sprite.body.x = newX;
        sprite.body.y = newY;
    }
    sprite.x = newX;
    sprite.y = newY;
};

export function loadPlayedLevels(difficulty,defaultLevelId) {
    let levels = [defaultLevelId],
        savegame = getSavegame();
    if (!savegame || !savegame.playedLevels || !savegame.playedLevels[difficulty]) {
        return levels;
    }

    let storedLevelsForDifficulty = savegame.playedLevels[difficulty];
    if (storedLevelsForDifficulty instanceof Array && storedLevelsForDifficulty.length > 0) {
        return storedLevelsForDifficulty;
    }

    return levels;
}

export function storePlayedLevel(difficulty, levelId) {
    let savegame = getSavegame();
    let playedLevels = loadPlayedLevels(difficulty,levelId);
    playedLevels.push(levelId);
    playedLevels = playedLevels.filter((val,index,self) => self.indexOf(val) === index);

    savegame.playedLevels = savegame.playedLevels || {};
    savegame.playedLevels[difficulty] = playedLevels;
    saveSavegame(savegame);
}


const savegameKey = 'sensitive-savegame';

export function getSavegame() {
    let savegame = localStorage.getItem(savegameKey);
    try {
        savegame = JSON.parse(savegame);
        if (!savegame) {
            throw new Error();
        }
    } catch(e) {
        savegame = {
            playedLevels: {}
        };
    }
    return savegame;
}

export function saveSavegame(savegame) {
    savegame = JSON.stringify(savegame || {});
    localStorage.setItem(savegameKey, savegame);
}
