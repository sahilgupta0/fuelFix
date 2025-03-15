const dotenv = require('dotenv');
dotenv.config();


const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World'); 
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log('Server is running on port 3000');
})