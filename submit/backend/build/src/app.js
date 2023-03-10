import express from 'express'
import cors from 'cors'
import { addJoke, getJokes, validateJoke, getJokeById, deleteJoke, fetchTypes, acceptJoke, getAllJokes, updateJoke, getTypes } from './service.js';
import bodyParser from "body-parser"
import swaggerUi from 'swagger-ui-express'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const swaggerDocument = require("../swagger.json");

const app = express();
app.use(cors({origin: '*'}));
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const PORT = 8080;

app.get("/joke", async (req, res) => res.json(await getJokes()))

app.get("/joke/all", async (req, res) => res.json(await getAllJokes()))

app.post("/joke", (req, res) => {
    console.log('Body: ', req.body)
    if (validateJoke(req.body) == '') {
        res.status(201)
        return res.json(addJoke(req.body))
    }
    res.status(400).send({error: validateJoke(req.body)})
})
app.delete("/joke/:id", async (req, res) => {
    const jokeWasDeleted = await deleteJoke(req.params.id)
    if (jokeWasDeleted) return res.json(true)
    res.status(406).send(false)
})

app.get("/joke/:id", async (req, res) => res.json(await getJokeById(req.params.id)))

app.put("/joke/:id", async (req, res) => {
    const joke = await updateJoke(req.params.id, req.body)
    if (joke != false) {
        res.json(joke)
    }
    else res.status(406).send("Item not found!")
})

app.put("/joke/:approvalStatus/:id", async (req, res) => {
    const joke = await acceptJoke(req.params.id, req.params.approvalStatus)
    if (joke != false) {
        res.json(joke)  
    }
    else res.status(406).send("Item not found!")
})

app.get("/types", async (req, res) => res.json(await getTypes()))

app.listen(PORT, () => {
    fetchTypes()
    console.log(`🚀 Server started on port ${PORT}`);
});