const express = require('express');
const cors = require('cors');
const { Client } = require('pg');
const app = express();
const port = 3000;
const DATABASE_URL = "postgresql://carlo:IiiBUu31w-HYTDhFIQuz1g@sturdy-grivet-2194.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/sburoList?sslmode=verify-full";

const client = new Client(DATABASE_URL);  //process.env.DATABASE_URL

(async () => {
    await client.connect();
})();

// Abilita CORS
app.use(cors()); // Permette tutte le origini

app.use(express.json());

app.get('/', async (req, res) => {
    console.log("lol");
});

app.get('/anime', async (req, res) => {
    try {
        const results = await client.query("SELECT id, titolo, numeroep FROM anime;");
        res.json(results.rows); // Invia i risultati come JSON
    } catch (err) {
        console.error("error executing query:", err);
        res.status(500).send("Errore nel database");
    }
});

app.post('/AddAnime', async (req, res) => {
    const { titolo, numeroEp } = req.body; // Estrai titolo e numero di episodi dal body della richiesta

    if (!titolo || !numeroEp) {
        return res.status(400).send("Titolo e numero di episodi sono richiesti!");
    }

    try {
        const results = await client.query("INSERT INTO anime (Titolo, NumeroEp) VALUES ($1, $2) RETURNING *;", [titolo, numeroEp]);
        res.json(results.rows); // Invia i risultati (nuovo record) come JSON
    } catch (err) {
        console.error("error executing query:", err);
        res.status(500).send("Errore nel database");
    }
});

app.listen(port, () => {
    console.log(`Server in ascolto su http://localhost:${port}`);
});


//allera per fare partire il tutto bisogna creare due terminali e rannare questo solo se dopo avere fatto tutto non funziona
// $env:DATABASE_URL = "postgresql://carlo:IiiBUu31w-HYTDhFIQuz1g@sturdy-grivet-2194.jxf.gcp-europe-west1.cockroachlabs.cloud:26257/sburoList?sslmode=verify-full"
//ovviamente se non funziona rigenerare la passworld su https://cockroachlabs.cloud/cluster/2a9c631b-d374-4153-8f58-429674689648/overview

//nei due terminali avviere nel primo il server nodejs con il comando node server.js
//nel secondo avviare http-server -p 8080 e andando all URL http://localhost:3000/anime avremo i dati dell'api
//mentre all URL http://localhost:8080/collegamento.html avremo la pagina html con i dati presi e stampati