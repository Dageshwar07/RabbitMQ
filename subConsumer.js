const amqp = require("amqplib");

async function recieveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const sub_queue = "subscribe_user_mail_queue";


        await channel.assertQueue(sub_queue, { durable: false });

        console.log("📥 Waiting for messages...");

        channel.consume(sub_queue, (message) => {
            if (message !== null) {
                console.log("📩 Received message for subscribed user:", JSON.parse(message.content.toString()));
                channel.ack(message); // Acknowledge the message
            }
        });

    } catch (error) {
        console.error("❌ Error receiving mail:", error);
    }
}

recieveMail();
