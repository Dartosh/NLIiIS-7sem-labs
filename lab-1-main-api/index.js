import express from 'express';

import cors from 'cors';

import appRouter from './api/app.router';

const corsOptions = {
    origin: '*'
};

const app = express();

// app.use(express.static('./Project/public'));
// app.use(express.static('./Project/api'));

app.use(express.json({ strict: false }));

app.use(cors(corsOptions));
app.use('/', appRouter);


app.listen(3001, () => {
    console.log(`Lab-1 app is running at localhost: 3001`);
});
