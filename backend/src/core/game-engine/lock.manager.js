const locks = new Map();

/**
 * Garantiza ejecución exclusiva por gameId
 */
async function withGameLock(gameId, fn) {
  const current = locks.get(gameId) || Promise.resolve();

  let release;
  const next = new Promise(res => (release = res));

  locks.set(gameId, current.then(() => next));

  try {
    await current;
    return await fn();
  } finally {
    release();

    // limpieza para evitar memory leak
    if (locks.get(gameId) === next) {
      locks.delete(gameId);
    }
  }
}

module.exports = { withGameLock };
