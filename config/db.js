const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connected to MONGODB")
    })
    .catch((err) => {
        console.error("Failed to connect to MONGODB " + err)
    })