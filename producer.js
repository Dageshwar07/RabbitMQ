const amqp = require("amqplib");

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const exchange = "mail_exchange";
        const routingKey = "send_mail";
        const queue = "mail_queue";

        // Declare exchange
        await channel.assertExchange(exchange, "direct", { durable: false });

        // Declare queue and bind to exchange
        await channel.assertQueue(queue, { durable: false });
        await channel.bindQueue(queue, exchange, routingKey);

        // Message to send
        const message = {
            to: "pratik@gmail.com",
            from: "dageshwardasmanikpuri996@gmail.com",
            subject: "Hello from queue",
            body: "Hello Dagesh"
        };

        // Publish message to exchange with routing key
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message), { persistent: true }));

        console.log("✅ Mail data sent:", message);

        setTimeout(() => {
            connection.close();
        }, 5000);
    } catch (error) {
        console.error("❌ Error sending mail:", error);
    }
}

sendMail();
