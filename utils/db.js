const config = require('../config');
const fs = require("fs");
const DBFILE = config.dbfile;
const CHATDB = config.chatdb;

async function readDb(file) {
    return new Promise((res, rej) => {
        fs.readFile(file, 'utf8', (err, data) => {
            err ? rej(err) : res(data)
        });
    })
}

async function writeFile(json, file) {
    return new Promise((res, rej) => {
        fs.writeFile(file, JSON.stringify(json, null, 2), "utf8", (err) => {
            err ? rej(err) : res();
        });
    })
}

async function updateLastMsgId(num) {
    try {
        const work = await writeFile({
            lastMsgId: num
        }, DBFILE)
    } catch (err) {
        console.log("error, couldnt save to file " + err)
    }
}

async function getLastMsgId() {
    try {
        const readFile = await readDb(DBFILE);
        const file = JSON.parse(readFile)
        return file.lastMsgId;
    } catch (err) {
        console.log("file not found so making a empty one and adding default value " + err)
        await updateLastMsgId(1);
        return 1;
    }
}

async function getChat() {
    try {
        const readFile = await readDb(CHATDB);
        const file = JSON.parse(readFile)
        return file.chat;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function updateChat(obj) {
    try {
        const work = await writeFile({
            chat: obj
        }, CHATDB)
    } catch (err) {
        console.log("error, couldnt save chat to file " + err)
    }
}

module.exports = { updateLastMsgId, getLastMsgId, getChat, updateChat }