const {server,io} = require('../server');


async function crear_room(io, partidaID) {
    io.join(partidaID)

}
