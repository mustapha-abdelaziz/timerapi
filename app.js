const express = require("express");
const fs = require("fs");
const socket = require("socket.io");
const cors = require('cors')
const app = express();

app.use(cors({origin: 'https://obs-timer-api.herokuapp.com'}))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = process.env.PORT || 3000;

app.use("/", (req, res) => {
	res.send("<h1>listening to port: </h1>");
});

const server = app.listen(port);

const io = socket(server);
io.on("connection", function (socket) {
	let rawdata = fs.readFileSync("time.json");
	let currentTimerTimestamp = JSON.parse(rawdata);
	io.sockets.emit("server-connection", currentTimerTimestamp);

	socket.on("counter", (time) => {
		io.sockets.emit("emited-counter", time);

		data = {
			timer: time,
			submittedOn: Date.now(),
		};
		fs.writeFileSync("time.json", JSON.stringify(data));
	});
});
