import { getTypes, init, getJokes, addJoke } from "./services.js";
import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import swaggerUi from 'swagger-ui-express'

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')));
const PORT = 8080;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/jokes/type=:type?/:count?/", async (req, res) => {
    const data = await getJokes(req)
    if (data == "Unknown Parameter!") return res.status(400).send({ error: data })
    res.json(data)
});

app.get("/getTypes", async (req, res) => res.json(await getTypes(res)))

app.post("/joke", async (req, res) => { 
    const jokeAdded = await addJoke(req.body)
    console.log(req.body)
    if (jokeAdded == true) {
        return res.json("")
    }
    res.status(400).send({ jokeAdded })
})

app.use(errorHandler)

app.listen(PORT, () => {
    init()
    console.log(`🚀 Server started on port ${PORT}`);
});

function errorHandler(err, req, res, next) {
    if (res.headersSent) {
        return next(err)
    }
    res.status(400)
    res.render('error', { error: err })
}