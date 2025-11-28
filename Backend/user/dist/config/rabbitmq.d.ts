import amqp from "amqplib";
export declare const connectRabbitMq: () => Promise<amqp.Channel | undefined>;
export declare const publishtoQueue: (queueName: string, message: any) => Promise<void>;
//# sourceMappingURL=rabbitmq.d.ts.map