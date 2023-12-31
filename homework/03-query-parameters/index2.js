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
    let sql;
    if (req.query.cityID != undefined && req.query.countryCode != undefined) {
        // if I give both,
        // I can try to get cityID and see if the city with the country code exists
        // if not, then empty result

        res.json({ error: "Please use only cityID OR countryCode." });
        return;
        // from here on, I know that NOT both are defined
    } else if (req.query.cityID != undefined) {
        // the user specified `cityID`, so let's give them the city with the right ID
        sql = `SELECT * FROM cities WHERE cities.ID=${req.query.cityID}`;
    } else if (req.query.countryCode != undefined) {
        // the user specified `countryCode`, so let's give them a random city from that country
        sql = `SELECT * FROM cities WHERE CountryCode="${req.query.countryCode}" ORDER BY RAND() LIMIT 1`;
    } else {
        // nothing is specified, so we choose any random city
        sql = `SELECT * FROM cities ORDER BY RAND() LIMIT 1`;
    }
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
