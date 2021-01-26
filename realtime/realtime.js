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

const run = async (consumer) => {
    await consumer.connect();
    await consumer.subscribe({ topic: "chat", fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            console.log(topic, partition, message);
            io.to("chat").emit("message", JSON.parse(message.value));
        },
    });
};

const consumer = kafka.consumer({ groupId: "chatTestGroup" });

run(consumer).catch((e) => console.error(`kafkajs: ${e.message}`, e));

io.on("connection", (socket) => {
    console.log("connecting", socket);
    socket.join("chat");
    socket.emit("message", {
        userId: "Server",
        messageId: -1,
        message: "Connection Successful! More messages on the way!",
    });

    socket.on("disconnect", () => {
        console.log("disconnecting", socket);
    });
});

httpServer.listen(81);
