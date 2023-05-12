# PeetCode Evaluator

This is a simple backend project which evaluates PeetCode submissions

### Disclaimer

- This is a very simple and crude implementation
- Compiles and rules only C++ programs for now
- Assumes that the solutions are simple integers
- Right now the problem numbers and their corresponding solutions are hardcoded

## Features

A simple backend system which gets new submissions, pushes it to a RabbitMQ queue.
A receiver reads it off the queue, starts (or creates) a container, and executes the code inside the sandbox environment.
The result of the evaluation is the passed back to the caller.

## Tech stack used

- RabbitMQ
- NodeJS
- Docker

## Installation

- To run the program, it is expected that RabbitMQ is set up and running on port `5672`.
- Install the dependencies using `npm install`
- Start the receiver by running `node queue/receiver.js`
- Start the server by running `node routes.js`. This automatically starts the sender as well
