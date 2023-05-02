require('dotenv').config()
import bodyParser from "body-parser";
import cors from "cors";
import request from 'request';
import prisma from '@primsa/client'
import auth from './auth';
import createError from 'http-errors'; // intercept errors and properly pass them to the client as a message

import express, { Request, Response, Application, NextFunction, ErrorRequestHandler } from 'express'
const app: Application = express();

app.use(cors({
    origin: process.env.ALLOWED_CORS_SOURCES?.split(',')
}));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', auth);
// credit: eol, https://stackoverflow.com/questions/62487202/how-to-download-file-from-url-using-express
app.get('/download/*', (req: Request, res: Response, next: NextFunction) => {
    var url = req.params[0]
    if (url) {
        if (url[0] === '/') {
            url = url.slice(1)
        }
        res.set(
            'Content-Disposition',
            `attachment; filename=${url.split('/').pop()}`
        );

        request(url).pipe(res);
    } else {
        res.send("ERROR: The resource's url isn't valid.")
    }
});
app.use( async (req: Request, res: Response, next: NextFunction) => {
    next(createError.NotFound('Route not Found'))
})
app.use( (err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err?.status || 500).json({
        status: false,
        message: err.message
    })
})

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log("------------------")
    console.log(`Server is running on port ${PORT}.`);
    console.log("------------------")
});

process.on('uncaughtException', function (err: string) {
    console.log(err);
}); 