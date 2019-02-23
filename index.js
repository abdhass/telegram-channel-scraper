
const { getChat, chatHistory } = require('./chat-history')
const db = require('./utils/db');
const {checkLogin} = require('./utils/node-storage');

const run = async (chat) => {
  await chatHistory(chat)
}

const start = async () => {
  await checkLogin();

  let chat = await db.getChat();

  if (!chat) {
    chat = await getChat();
    await db.updateChat(chat)
  }

  let timerId = setTimeout(function tick() {
    run(chat);
    timerId = setTimeout(tick, 60000);
  }, 2000);
}

start()