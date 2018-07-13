require('dotenv').config()
const fs = require('fs')
let nodeRSA = require('node-rsa')
let privkey = null
let pubkey = null
if (fs.existsSync('./privkey.key') && fs.existsSync('./pubkey.key')) {
  console.log("Found Private Key")
  const priv = fs.readFileSync("./privkey.key", "utf8");
  const pub = fs.readFileSync("./pubkey.key", "utf8");
  privkey = new nodeRSA(priv)
  pubkey = new nodeRSA(pub)
} else {
  console.log("No Private Key found, creating a new pair")
  key = new nodeRSA()
  key.generateKeyPair()
  const priv = key.exportKey('private')
  const pub = key.exportKey('public')
  fs.writeFileSync('./privkey.key', priv, {
    encoding: 'utf8'
  })
  fs.writeFileSync('./pubkey.key', pub, {
    encoding: 'utf8'
  })
  privkey = new nodeRSA(priv)
  pubkey = new nodeRSA(pub)
}
exports.privkey = privkey
exports.pubkey = pubkey
exports.monoguri = process.env.mongouri || "mongodb://skrypt_db:27017"
exports.jwtsecret = "27bedfa86331f863d0ded6520e56cb0d6cd3446241390f3ff8"
exports.redisPort = process.env.redisPort || 6379
exports.redisIP = process.env.predisIP || '127.0.0.1'
exports.port = process.env.port || 3000