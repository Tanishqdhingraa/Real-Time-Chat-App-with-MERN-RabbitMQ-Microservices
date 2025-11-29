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
        console.log("✅ Mail service consumer started and listening for OTP emails");
        channel.consume(queueName, async (msg) => {
            if (!msg)
                return;
            try {
                const { to, subject, body } = JSON.parse(msg.content.toString());
                // ✔ Correct Gmail SMTP configuration
                const transporter = nodemailer.createTransport({
                    service: "gmail",
                    auth: {
                        user: process.env.MAIL_USER, // your email
                        pass: process.env.MAIL_PASSWORD, // your app password
                    },
                });
                await transporter.sendMail({
                    from: process.env.MAIL_USER, // sender email
                    to: to,
                    subject: subject,
                    text: body,
                });
                console.log("📩 OTP Email Sent To:", to);
                channel.ack(msg);
            }
            catch (error) {
                console.log("❌ Error sending mail:", error);
            }
        });
    }
    catch (error) {
        console.log("FAILED TO START THE CONSUMER IN RABBITMQ");
    }
};
//# sourceMappingURL=consumer.js.map