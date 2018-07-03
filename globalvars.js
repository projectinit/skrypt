require('dotenv').config()
exports.monoguri = process.env.mongouri || "mongodb://skrypt_db:27017"
