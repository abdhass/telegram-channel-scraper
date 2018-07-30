# telegram-channel-scraper in NodeJS


Telegram Channel Scraper using **Telegram Mobile Protocol** [(MTProto)](https://core.telegram.org/mtproto) library forked from this repo **[(Telegram MTProto ES6)](https://github.com/zerobias/telegram-mtproto)**

## About Telegram Channel Scraper

This nodejs program was forked from **[Telegram MTProto](https://github.com/zerobias/telegram-mtproto)**

You can use it to grab messages from any channel (by default or user chats) and send it as JSON to any server. Some potential uses:

 - Monitor telegram news channels and send to google sheets for further processing. (Google Apps Script server on Google Sheets is very simple to set up)

 - Grab signals from Forex / Crypto telegram channels and send to server for automated trading



## Installation

Clone this repo. Then 
```bash 
$ cd telegram-channel-scraper
$ npm i
```

Fill in `.env.example` then rename to `.env` 
 
The telegram_api_id and telegram_api_hash values can be obtained here: [https://my.telegram.org/](https://my.telegram.org/)


## Usage


Make sure your in a telegram channel or create your own one to test.

Then run the program
```bash 
$ node index.js
```

It is currently set up to poll the telegram server every 60 seconds. I had trouble setting up updates from telegram so instead I set it up as setTimeout. 

Send another message to your channel and watch it send to your server again.

## Contribute
Would love for someone to implement the updates feature so the app doesnt need to constantly poll the server for new messages. Feel free to send a pull request.

## License

Free for all to use