import amqp from "amqplib";
let channel;
export const connectRabbitMq = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });
        channel = await connection.createChannel();
        console.log("👌 Connected to RabbitMQ and channel created");
        return channel;
    }
    catch (error) {
        console.error("Failed to connect to RabbitMQ", error);
    }
};
export const publishtoQueue = async (queueName, message) => {
    if (!channel) {
        console.log("RABBITMQ CHANNEL IS NOT INITIALIZED");
        return;
    }
    await channel.assertQueue(queueName, { durable: true });
    channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        persistent: true,
    });
};
//# sourceMappingURL=rabbitmq.js.map