import amqp from "amqplib";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
export const startsentoptcosnumer = async () => {
    try {
        const connection = await amqp.connect({
            protocol: "amqp",
            hostname: process.env.RABBITMQ_HOST,
            port: 5672,
            username: process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD,
        });
        const channel = await connection.createChannel();
        const queueName = "send-otp";
        await channel.assertQueue(queueName, { durable: true });
        console.log("✅ Mail service consumer started and listending for otp emails");
        channel.consume(queueName, async (msg) => {
            if (msg) {
                try {
                    const { to, string, body } = JSON.parse(msg.content.toString());
                    const transporter = nodemailer.createTransport({});
                }
                catch (error) {
                }
            }
        });
    }
    catch (error) {
        console.log("FAILED TO START THE CONSUMER IN RABBITMQ");
    }
};
//# sourceMappingURL=consumer.js.map