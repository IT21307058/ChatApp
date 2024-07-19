
const express = require("express");
const app = express();
require("./db/connection")

const PORT = process.env.PORT || 8000;

// app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(PORT, () => {
    console.log(`Server start at port no ${PORT}`)
})