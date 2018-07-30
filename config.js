require('dotenv').config();

const config = {
    telegram: {
        id: process.env.TELEGRAM_APP_ID,
        hash: process.env.TELEGRAM_APP_HASH,
        phone: process.env.TELEGRAM_PHONE_NUMBER,
        storage: 'storage/telegram.json',
        devServer: false,
        msgHistory: {
            maxMsg: 400,
            limit: 0,
        },
        getChat: {
            limit: 50
        },
    },
    dbfile: 'storage/db.json',
    chatdb: 'storage/chat.json',
    server: process.env.SERVER_URL
}

module.exports = config;