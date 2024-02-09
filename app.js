const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv').config({ path: './config.env' });
const router = require('./routes/apiRoutes');

const app = express();

app.use(express.json());
app.use(morgan('tiny'));

app.use('/emotion', router);

app.listen(process.env.PORT, (error) => {
    if (error) return console.log(error);

    console.log(`Express listening on port ${process.env.PORT}`);
});