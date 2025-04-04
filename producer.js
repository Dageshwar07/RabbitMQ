const amqp = require("amqplib");

async function sendMail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        
        const exchange = "mail_exchange";
        const routingKeyForSubUser = "send_mail_to_subscribe_user";
        const routingKeyForNormalUser = "send_mail_to_user";
        const sub_queue = "subscribe_user_mail_queue";
        const user_queue = "user_mail_queue";

        // Declare exchange
        await channel.assertExchange(exchange, "direct", { durable: false });

        // Declare queue and bind to exchange
        await channel.assertQueue(sub_queue, { durable: false });
        await channel.assertQueue(user_queue, { durable: false });

        await channel.bindQueue(sub_queue, exchange, routingKeyForSubUser);
        await channel.bindQueue(user_queue, exchange, routingKeyForNormalUser);

        // Message to send
        const message = {
            to: "pratik@gmail.com",
            from: "dageshwardasmanikpuri996@gmail.com",
            subject: "Hello from queue",
            body: "Hello Dagesh"
        };

        // Publish message to exchange with routing key
        channel.publish(exchange, routingKeyForSubUser, Buffer.from(JSON.stringify(message), { persistent: true }));
        channel.publish(exchange, routingKeyForNormalUser, Buffer.from(JSON.stringify(message), { persistent: true }));

        console.log("✅ Mail data sent:", message);

        setTimeout(() => {
            connection.close();
        }, 5000);
    } catch (error) {
        console.error("❌ Error sending mail:", error);
    }
}

sendMail();
