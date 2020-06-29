const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = 3000

app.use(bodyParser.json())

app.post('/', (req, res) => {
    console.log(req.body)
    res.send('Hello')
})


app.listen(PORT, () => {
    console.log(`Server running ${PORT}`)
})