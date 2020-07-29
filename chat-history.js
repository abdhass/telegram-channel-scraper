const { pluck } = require('ramda')
const { inputField } = require('./utils/fixtures')
const config = require('./config')
const fetch = require("node-fetch")
const db = require('./utils/db');

const telegram = require('./utils/init')

const getChat = async () => {
  const dialogs = await telegram('messages.getDialogs', {
    limit: parseInt(config.telegram.getChat.limit,10),
  })
  const { chats } = dialogs
  const selectedChat = await selectChat(chats)
  console.log(selectedChat);
  return selectedChat
}

const chatHistory = async (chat) => {
  let lastIdofMsgs = await db.getLastMsgId();

  const max = config.telegram.msgHistory.maxMsg
  const limit = config.telegram.msgHistory.limit || 99
  let offsetId = 0
  let full = [],
    messages = [];

  do {
    let history = await telegram('messages.getHistory', {
      peer: {
        _: 'inputPeerChannel',
        channel_id: chat.id,
        access_hash: chat.access_hash
      },
      max_id: -offsetId,
      offset: -full.length,
      limit
    })

    messages = history.messages.filter(filterLastDay);
    full = full.concat(messages);
    messages.length > 0 && (offsetId = messages[0].id);

    if (messages.length > 0) {
      await db.updateLastMsgId(messages[0].id)
    }
    history = null;
  } while (messages.length === limit && full.length < max)


  const showNew = full.filter(({ id }) => id > lastIdofMsgs)
  const noRepeats = uniqueArray(showNew, 'id')
  const usersMsg = noRepeats.filter(filterUsersMessages)
  
  if (usersMsg.length>0){
    const done = await sendToServer(usersMsg)
    printMessages(usersMsg)
    console.log("saved to server: ",done)
    console.log("Last msg id ", messages[0].id)
  }
  lastIdofMsgs = await db.getLastMsgId();
  const dt = new Date()
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  console.log( `${hours}:${mins} - [${lastIdofMsgs}]`)
}

let sent = []

const sendToServer = async (messages) => {
	let toPush = messages.filter(m => {
		return sent.indexOf( m ) < 0;
	})
	messages.forEach(m => {
		sent.push(m.id)
	});
  const response = await fetch(config.server,
    {
      method: 'POST',
      body: JSON.stringify(toPush),
      headers: { "Content-Type": "application/json" }
    })
  const json = await response.json();
  return json
}

const printMessages = (messages) => {
  const formatted = messages.map(formatMessage)
  formatted.forEach(e => console.log(e))
}

const uniqueArray = function(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}
const filterLastDay = ({ date }) => new Date(date * 1e3) > dayRange()
const dayRange = () => Date.now() - new Date(86400000 * 4)
const filterUsersMessages = ({ _ }) => _ === 'message'

const formatMessage = ({ message, date, id }) => {
  const dt = new Date(date * 1e3)
  const hours = dt.getHours()
  const mins = dt.getMinutes()
  return `${hours}:${mins} [${id}] ${message}`
}

const selectChat = async (chats) => {
  const chatNames = pluck('title', chats)
  console.log('Your chat list')
  chatNames.map((name, id) => console.log(`${id}  ${name}`))
  console.log('Select chat by index')
  const chatIndex = await inputField('index')
  return chats[+chatIndex]
}

module.exports = {
  getChat,
  chatHistory,
}
