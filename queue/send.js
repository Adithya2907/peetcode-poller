import amqp from "amqplib";

let queue;

async function createQueue() {
  // Establishing a connection
  const connection = await amqp.connect("amqp://localhost"); // Replace with your RabbitMQ connection URL
  const channel = await connection.createChannel();

  // Setting up the queue
  const queueName = "submission3"; // this is the rpc callback queue
  const assert = await channel.assertQueue(queueName, { exclusive: true, durable: false });

  return { connection, channel, queue: assert.queue };
}

async function sendMessage(message) {
  const { channel } = queue;
  try {
    // callback
    const correlationId = generateUuid();
    const replyPromise = new Promise((resolve, reject) => {
      channel.consume(
        queue.queue,
        (message) => {
          resolve(message.content.toString());
        },
        {
          noAck: true,
        }
      );
    });

    // Sending the message to the queue
    console.log("Sending: %s with ID %s", message, correlationId);
    channel.sendToQueue("rpc_queue", Buffer.from(message), {
      correlationId: correlationId,
      replyTo: queue.queue,
    });

    console.log("Message sent successfully.");

    // waiting for reply
    const reply = await replyPromise;
    console.log(" [X] Reply: ", reply);

    return reply;
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export async function addToQueue(submission) {
  const message = JSON.stringify(submission);
  return await sendMessage(message);
}

function generateUuid() {
  return Math.random().toString() + Math.random().toString() + Math.random().toString();
}

createQueue()
  .then((res) => {
    queue = res;
    console.log("Ok, created");
  })
  .catch((error) => {
    console.log("Error: ", error);
  });
