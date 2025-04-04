const amqp = require("amqplib");

async function recieveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const user_queue = "user_mail_queue";


        await channel.assertQueue(user_queue, { durable: false });

        console.log("📥 Waiting for messages...");

        channel.consume(user_queue, (message) => {
            if (message !== null) {
                console.log("📩 Received message for normal user:", JSON.parse(message.content.toString()));
                channel.ack(message); // Acknowledge the message
            }
        });

    } catch (error) {
        console.error("❌ Error receiving mail:", error);
    }
}

recieveMail();
