const mongoose = require("mongoose");

const url = `mongodb+srv://bhanukadayanana:eKTbje4ZINqdrbpy@cluster0.4du6r1o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


mongoose.connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => console.log("Database Connected")).catch((err) => {
    console.log(err)
})

