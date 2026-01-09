const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const {checkUser, requireAuth} = require('./middleware/auth.middleware')

/////// IMPORTATION DES ROUTES

const UserRoutes = require('./router/user.routes');
const PostRoutes = require('./router/post.routes')

/////// CONFIGURATION DOTENV ET DATABASE

dotenv.config({
    path: "./config/.env"
})
require('./config/db')


/////// VARIABLES

const app = express()
const port = process.env.PORT || 5000


/////// CONFIGURATION DU BODY PARSER ET COOKIE PARSER

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())


/////// JWT ET MIDDLEWARE

app.use(checkUser)
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
})

/////// ROUTES

app.use('/api/user', UserRoutes)
app.use('/api/post', PostRoutes)


/////// LANCEMENT DU SERVER

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}...`)
})
