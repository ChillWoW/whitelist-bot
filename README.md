1. 
```bash
npm install
``` 

2. Muokkaa config.js

```javascript
TOKEN: "BOT_TOKEN",
MONGOURL: "MONGO_URL",
COLOR: "303136", //väri

WHITELIST_SYSTEM: {
  ENABLED: true,
  WHITELIST_ROLE: "ID",
  SEND_CHANNEL: "ID",
  CHECK_CHANNEL: "ID",
  MINLENGTH: "200",
  MAXLENGTH: "2000",
},

ACTIVITY: {
  ENABLED: false,
  STATUS: "online", // [online, idle, dnd, invisible]
  TYPE: "WATCHING", // [PLAYING, LISTENING, WATCHING, COMPETING]
  MESSAGE: "",
},
```

3. Käynnistä
```bash
node index.js
```
