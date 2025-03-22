const amqp = require("amqplib");

async function recieveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const queue = "mail_queue";

        await channel.assertQueue(queue, { durable: false });

        console.log("📥 Waiting for messages...");

        channel.consume(queue, (message) => {
            if (message !== null) {
                console.log("📩 Received message:", JSON.parse(message.content.toString()));
                channel.ack(message); // Acknowledge the message
            }
        });

    } catch (error) {
        console.error("❌ Error receiving mail:", error);
    }
}

recieveMail();
