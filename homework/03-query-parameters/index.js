const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "world",
});

app.get("/getCity", function (req, res) {
    console.log(req.query);

    // please note: this "hand crafting SQL" is only for learning purposes
    // totally not recommened in your real world app (thing to look for: template query TODO)
    let sql = "SELECT * FROM cities";
    if (req.query.cityID != undefined) {
        // the user specified `cityID`, so let's give them the city with the right ID
        sql = sql + ` WHERE cities.ID=${req.query.cityID}`;
    }
    if (req.query.countryCode != undefined) {
        // the user specified `countryCode`, so let's give them a random city from that country
        sql = sql + ` WHERE CountryCode="${req.query.countryCode}"`;
    }
    if (req.query.random == "true") {
        // nothing is specified, so we choose any random city
        sql = sql + ` ORDER BY RAND()`;
    }
    // I always want to limit the result to 1
    sql = sql + ` LIMIT 1`;

    // now send our hand crafted query to the DB
    connection.query(sql, function (err, result) {
        if (err) {
            console.log(err);
            res.json("An error occurred.");
            return;
        }
        res.json(result);
    });
});

app.listen(port, function () {
    console.log(`App started on port ${port}`);
});
