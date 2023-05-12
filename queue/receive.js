import amqp from "amqplib";
import { beginExecution } from "../execute.js";

async function consumeMessage() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "rpc_queue";
    await channel.assertQueue(queueName, { durable: false });

    channel.consume(
      queueName,
      (message) => {
        if (message !== null) {
          const submission = JSON.parse(message.content.toString());

          // Acknowledge the message
          beginExecution(submission.solution)
            .then((res) => {
              console.log(res);
              // sending the result back to the sender
              channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(JSON.stringify(res), {
                  correlationId: message.properties.correlationId,
                })
              );
            })
            .catch((error) => {
              console.log(error);
              // sending the result back to the sender
              channel.sendToQueue(
                message.properties.replyTo,
                Buffer.from(JSON.stringify(error), {
                  correlationId: message.properties.correlationId,
                })
              );
            });

          channel.ack(message);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.log("Error: ", error);
  }
}

async function main() {
  await consumeMessage();
}

main()
  .then(() => {
    console.log("Ok, receiver listening...");
  })
  .catch(console.error);
