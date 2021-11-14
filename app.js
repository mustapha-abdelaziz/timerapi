const express = require("express");
const app = express();
const fs = require("fs");
const cors = require("cors");

app.use(cors())

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/timer", (req, res) => {
	let rawData = fs.readFileSync("time.json");
	let obj = JSON.parse(rawData);
	res.json(obj);
});



const port = process.env.PORT || 3000;

const server = app.listen(port);

const io = require("socket.io")(server, {
	cors:{
		origin: '*',
	}
});

io.on("connection", function (socket) {
	requestSentAt = socket.handshake.query.connectedAt;

	socket.on("counter", (time, string) => {
		
		data = {
			timer: time,
			submittedOn: Date.now(),
		};
		io.sockets.emit("emited-counter", data, Date.now());

		fs.writeFileSync("time.json", JSON.stringify(data));
	});
});
