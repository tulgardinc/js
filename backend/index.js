const { SerialPort, ReadlineParser } = require("serialport");
const app = require("express")();
const cors = require("cors");

const corsOpts = {
  origin: "*",

  methods: ["GET"],

  allowedHeaders: "*",
};

app.use(cors(corsOpts));

const PORT = 7070;

app.listen(PORT, () => console.log("working"));

var port = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 9600 });
var parser = port.pipe(new ReadlineParser());
var current_val = { x: 0, y: 0, z: 0 };

app.get("/vals", (req, res) => {
  res.status(200).send(current_val);
});

port.on("open", function () {
  console.log("open");
  parser.on("data", function (data) {
    const data_arr = data.split(",");
    current_val = {
      x: data_arr[0],
      y: data_arr[1],
      z: data_arr[2].slice(0, -1),
    };
    console.log(current_val);
  });
});
