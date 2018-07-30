var {MTProto} = require('telegram-mtproto')
const { Storage } = require('mtproto-storage-fs')
const config = require('../config')

const api = {
  layer          : 57,
  initConnection : 0x69796de9,
  api_id         : parseInt(config.telegram.id,10)
}

const app = {
  storage: new Storage(config.telegram.storage)
}

const server = {
  dev: config.telegram.devServer 
}

const telegram = MTProto({ server, api, app })

module.exports = telegram