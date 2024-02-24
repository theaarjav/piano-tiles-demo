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
    CONNECTION: 'connection',
    UPDATE_SPEED: 'updateSpeed',
    TILE_CLICK: 'tile_clicked',
    TIMER_UPDATE:'timerUpdate',
    SCORE_UPDATE:'scoreUpdate',
    LIFE_UPDATE:'lifeUpdate',
    LEVEL_START:"startLevel",
    GAME_START:"startGame",
    GAME_START_TILE:"startGameFromTile",
    GAME_OVER:"overGame",
    TEAM_NAME:"teamName",
    TEAM_DETAILS:"teamDetails",
    FAIL_LEVEL_TO_OPE:"failedLvlOpe",
    END_GAME:"endGame",
    GAME_STATUS_ON:"gameHasStarted",
    EMPTY_WAITING:"emptyWaiting",
    NET_SCORE_UPDATE:"upadateNetScore",
    FIRST_LEVEL:"firstLevel",
    TOTAL_SCORE:"totalScore"
};

export const COLORS = {
    CL01: '#FF0000',
    CL02: '#00FF00',
    CL03: '#0000FF',
    CL04: '#000000',
    CL05: '#FFFFFF',
};

export const LEVELS = [1,2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

export const REALM_MODELS = {
    USER: 'User',
    GAME: 'Game',
    OPERATOR: 'Operator',
    PLAYER: 'Player',
    TEAM: 'Team',
    BATTLE: 'Battle',
    GAME_PLAY: 'GamePlay'
};

export const REALM_KEYS = {
    ID: '_id',
    OBJECT_ID: 'objectId',
    NUMBER: 'number',
    STRING: 'string',
    BOOLEAN: 'boolean',
};


export const rows=13;
export const columns=7;
export const players=2;
