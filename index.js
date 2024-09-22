const axios = require('axios');
require('dotenv').config();

const energyUrl = 'https://api-yield-pass.masterprotocol.xyz/miniApp/api/v1/clicker-game/energy';
const startGameUrl = 'https://api-yield-pass.masterprotocol.xyz/miniApp/api/v1/clicker-game/start';
const endGameUrl = 'https://api-yield-pass.masterprotocol.xyz/miniApp/api/v1/clicker-game/end';

const token = process.env.TOKEN;

const SCORE_MIN = 900;
const SCORE_MAX = 1350;
const WAIT_TIME = 20000;

const colors = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
    }
};

const headers = {
    'Authorization': token,
    'Accept': 'application/json, text/plain, */*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'uk,en;q=0.9,en-GB;q=0.8,en-US;q=0.7',
    'Origin': 'https://miniapp-social.masterprotocol.xyz',
    'Referer': 'https://miniapp-social.masterprotocol.xyz/',
    'Sec-CH-UA': '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128", "Microsoft Edge WebView2";v="128"',
    'Sec-CH-UA-Mobile': '?0',
    'Sec-CH-UA-Platform': '"Windows"',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0'
};

async function getEnergy() {
    try {
        const response = await axios.get(energyUrl, { headers });
        return response.data;
    } catch (error) {
        console.error(colors.fg.red, 'Error getting energy:', error.message, colors.reset);
    }
}

async function startGame() {
    try {
        const response = await axios.post(startGameUrl, {}, { headers });
        return response.data.gameId;
    } catch (error) {
        console.error(colors.fg.red, 'Error starting game:', error.message, colors.reset);
    }
}

async function endGame(gameId, score) {
    try {
        const response = await axios.post(endGameUrl, {
            gameId: gameId,
            score: score
        }, { headers });
        console.log(colors.fg.green, `Game finished! Score: ${score}`, colors.reset);
    } catch (error) {
        console.error(colors.fg.red, 'Error ending game:', error.message, colors.reset);
    }
}

async function countdown(seconds) {
    for (let i = seconds; i > 0; i--) {
        process.stdout.write(colors.fg.yellow + `\rTime left: ${i} second(s)   ` + colors.reset);
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log();
}

async function playGame() {
    const energy = await getEnergy();
    console.log(colors.fg.blue, `Energy received: ${energy}`, colors.reset);

    for (let i = 0; i < energy; i++) {
        console.log(colors.fg.magenta, `\n--- Game #${i + 1} ---`, colors.reset);
        
        const gameId = await startGame();
        console.log(colors.fg.cyan, `Game started, gameId: ${gameId}`, colors.reset);

        console.log(colors.fg.yellow, 'Waiting 20 seconds to finish the game...', colors.reset);
        await countdown(WAIT_TIME / 1000);

        const score = Math.floor(Math.random() * (SCORE_MAX - SCORE_MIN + 1)) + SCORE_MIN;

        await endGame(gameId, score);
    }

    console.log(colors.fg.green, '\nAll games finished!', colors.reset);
}

playGame();
