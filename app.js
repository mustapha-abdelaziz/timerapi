const express = require("express");
const app = express();
const fs = require("fs");
const socket = require("socket.io");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 3000;


let time = "dsadsdasfqw";

app.use("/", (req, res)=>{
	console.log('app running on: ', port);
	res.send("<h1>listening to port: </h1>", port);
});

app.post("/api/setTimer", (req, res) => {
	time = req.body.mediaDuration;
});

app.get("/api/gettimer", (req, res) => {
	res.status(200).send("hello world " + time);
});

const server = app.listen(port, () => {
	console.log("listening to port ", port);
});

const io = socket(server);

io.on("connection", function (socket) {
	let rawdata = fs.readFileSync("time.json");
	let currentTimerTimestamp = JSON.parse(rawdata);
	io.sockets.emit("server-connection", currentTimerTimestamp);

	socket.on("counter", (time) => {
		io.sockets.emit("emited-counter", time);

		data ={
			"timer": time,
			"submittedOn": Date.now()
		}

		fs.writeFileSync("time.json", JSON.stringify(data));
	});
});
