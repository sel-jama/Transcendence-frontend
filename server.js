const express = require("express");
const path = require("path");

const app = express();

app.get("/*", (req, res) => {
    res.sendFile(path.resolve("index", index.html));
});

app.listen(process.env.PORT || 5000, () => console.log("server running ..."));
