var express = require("express");
var app = express();
var cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
app.use(cors());
app.use(express.json());
dotenv.config();

app.use(express.static(path.join(__dirname, "../raksa-web/dist/raksa")));

const paymentRouter = require("./routes/payment.routes");

app.get("*", function (req, res) {
  // res.send("CCavenu server!!");
  res.sendFile(path.join(__dirname, "../raksa-web/dist/raksa/index.html"));
});

app.use("/api", bodyParser.urlencoded(), paymentRouter);

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://localhost:3000", host, port);
});
