require('dotenv').config()
exports.monoguri = process.env.mongouri || "mongodb://skrypt_db:27017"
exports.jwtsecret = "27bedfa86331f863d0ded6520e56cb0d6cd3446241390f3ff8"
exports.redisPort = process.env.redisPort || 6379
exports.redisIP = process.env.predisIP || '127.0.0.1'
exports.port = process.env.port || 3000