// testPartida.js
const GameState = require('./game.state');
const GameLogic = require('./game.logic');
const BotLogic = require('./bot.logic');

// ======== Configuración de la partida ========
const players = [
    { userId: 'bot1' },
    { userId: 'bot2' },
    { userId: 'bot3' },
    { userId: 'bot4' }
];

const numCardsIni = 5;      // cartas iniciales por jugador
const specialCardsMode = true;
const rolesMode = false;

// ======== Inicializar GameState y GameLogic ========
const state = new GameState({ id: 'test1', players, numCardsIni, specialCardsMode, rolesMode });
const logic = new GameLogic(state);

// Crear un bot por jugador
const bots = {};
for (const p of players) {
    bots[p.userId] = new BotLogic(state, logic.cardRules, logic.turnManager);
}

// ======== Iniciar partida ========
logic.startGame();
console.log('=== PARTIDA INICIADA ===');
printGameState(state);

// ======== Bucle de turnos ========
const MAX_ROUNDS = 50; // límite para evitar bucle infinito
let round = 1;

while (state.players.some(p => p.hand.length > 0) && round <= MAX_ROUNDS) {
    console.log(`\n--- RONDA ${round} ---`);

    const currentPlayer = state.getCurrentPlayer();
    const bot = bots[currentPlayer.id];

    let move;
    try {
        move = bot.decideMove(currentPlayer.id);
    } catch (e) {
        console.error(`Error al decidir movimiento de ${currentPlayer.id}:`, e.message);
        break;
    }

    if (move.type === 'draw') {
        const card = logic.drawCard();
        state.addCardToPlayer(currentPlayer.id, card);
        console.log(`${currentPlayer.id} roba carta: ${card.color}-${card.value}`);
    } else if (move.type === 'play') {
        try {
            logic.playCard(currentPlayer.id, move.card);
            let extra = '';
            if (['playOdd','playEven'].includes(move.card.value)) extra = ' (filtro activado solo 1 turno)';
            console.log(`${currentPlayer.id} juega carta: ${move.card.color}-${move.card.value}${extra}`);
        } catch (e) {
            console.log(`No se pudo jugar la carta: ${e.message}`);
        }
    }

    // Imprimir estado resumido solo primeras 10 rondas para no saturar consola
    if (round <= 10) {
        printGameState(state);
    }

    round++;
}

// ======== Resultado final ========
if (round > MAX_ROUNDS) {
    console.log('\n--- Límite de rondas alcanzado ---');
} else {
    console.log('\n=== PARTIDA TERMINADA ===');
}

state.players.forEach(p => console.log(`${p.id} tiene ${p.hand.length} cartas`));

// ======== Función auxiliar para imprimir estado del juego ========
function printGameState(state) {
    console.log('Turno actual:', state.getCurrentPlayer().id);
    console.log('Carta actual:', state.currentCard ? `${state.currentCard.color}-${state.currentCard.value}` : 'ninguna');
    state.players.forEach(p => {
        console.log(`  ${p.id}: [${p.hand.map(c => c.color + '-' + c.value).join(', ')}]`);
    });
}