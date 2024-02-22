export const MODE = {
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
};

export const EVENT_TYPES = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    HAND_SHAKE: 'handShake',
    SELECT_LEVEL: 'selectLevel',
    START_LEVEL: 'startLevel',
    STOP_LEVEL: 'stopLevel',
    PASS_LEVEL: 'passLevel',
    FAIL_LEVEL: 'failLevel',
    WIN_GAME:"winGame",
    UPDATE_DIMENSION: 'updateDimension',
    LEVEL_GRIDS: 'levelGrids',
    UPDATE_SPEED: 'updateSpeed',
    TILE_CLICK: 'tile_clicked',
    CONNECTION:"connection",
    BLINK:"blink",
    TIMER_UPDATE:"timerUpdate",
    SCORE_UPDATE:"scoreUpdate",
    LIFE_UPDATE:"lifeUpdate",
    LEVEL_START:"startLevel",
    GAME_START:"startGame",
    GAME_START_TILE:"startGameFromTile",
    GAME_OVER:"overGame",
    BLUE_CLICK:"blue_click",
    RED_CLICK:"red_click",
    TEAM_NAME:"teamName",
    GAME_STATUS_ON:"gameHasStarted",
    TEAM_DETAILS:"teamDetails"
};

export const defaultRows = 6;
export const defaultColumns = 4;
export const defaultSpeed = 100;
export const defaultLevels = [];
export const defaulSelectedLevel = 1;
export const defaulGrids = [];