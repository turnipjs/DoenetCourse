(async () => {
    const httpServer = require("http").createServer();
    const io = require("socket.io")(httpServer, {
        cors: {
            origin: "http://localhost",
            methods: ["GET", "POST"],
        },
    });
    const { Kafka } = require("kafkajs");

    const kafka = new Kafka({
        clientId: "chatTest",
        brokers: ["kafka:9092"],
    });

    let topics = {};
    let removeTopic = (topicName) => {
        delete topics[topicName];
        console.log(`removing topic: ${topicName}`);
    };

    const producer = kafka.producer();
    await producer.connect();

    class Topic {
        constructor(topicName) {
            this.rooms = {};
            this.topicName = topicName;
            console.log("starting consumer for " + topicName);

            const run = async (consumer) => {
                await consumer.connect();
                console.log("subing to " + topicName);
                await consumer.subscribe({
                    topic: topicName,
                    fromBeginning: true
                });

                await consumer.run({
                    // partitionsConsumedConcurrently: 10, // TODO: enable concurrent consumption
                    eachMessage: async ({ topic, partition, message }) => {
                        console.log({ topic, partition, message: message.value });
                        io.to(`${topic}:${partition}`).emit(
                            "message",
                            message.value
                        );
                    },
                });
            };

            this.consumer = kafka.consumer({ groupId: "bous" });

            run(this.consumer).catch((e) => console.error(`kafkajs: ${e.message}`, e));
        }

        joinRoom(socket, roomId) {
            console.log("joining room: " + roomId);
            if (!this.rooms[roomId]) this.rooms[roomId] = [];
            if (this.rooms[roomId].includes(socket)) return;
            console.log("room not already included");
            socket.join(roomId);
            this.rooms[roomId].push(socket);
        }

        leaveRoom(socket, roomId) {
            console.log(`${socket.id} leaving room ${this.topicName}:${roomId}`)
            room = this.rooms[roomId];
            if (!room) return undefined;
            room.splice(room.indexOf(socket), 1);
            if (!room.length) delete this.rooms[roomId];
            if (!this.rooms.length) removeTopic(this.topicName);
            console.log(topics);
        }
    }


    io.on("connection", (socket) => {
        console.log("connecting", socket.id);
        socket.emit("message", '{"userId": "Server", "messageId": -1, "message": "Socket.io connection Successful! Try joining a room!"}');

        socket.on("produce", (m) => {
            producer.send({ s, partition, messages: [message] });
        });

        socket.on("joinRoom", (rm) => {
            console.log("join request for " + rm + " from " + socket.id);
            [topic, room] = rm.split(":");
            // TODO: permission check with main stack
            if (!topics[topic]) topics[topic] = new Topic(topic);
            topics[topic].joinRoom(socket, room);
        });

        socket.on("leaveRoom", (rm) => {
            console.log("leave request for " + rm + " from " + socket.id);
            [topic, room] = rm.split(":");
            if (!topics[topic]) return;
            topics[topic].leaveRoom(socket, room);
        });

        socket.on("disconnect", () => {
            console.log("disconnecting", socket.id);
            console.log(socket.rooms);
            for (let roomId of socket.rooms) {
                console.log("removing from: " + roomId);
                let [topic, room] = roomId.split(":");
                if (!topics[topic]) continue;
                topics[topic].leaveRoom(socket, room);
            }
        });
    });

    httpServer.listen(81);

})();
