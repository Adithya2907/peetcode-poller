# PeetCode Evaluator

This is a simple backend project which evaluates PeetCode submissions

### Disclaimer

- This is a very simple and crude implementation
- Compiles and rules only C++ programs for now
- Assumes that the solutions are simple integers
- Right now the problem numbers and their corresponding solutions are hardcoded
- Focused only on the backend evaluation part; haven't connected with frontend

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
- Docker must be installed and running on the system
- Build the image by running `docker build . -t <IMAGENAME>`. Make sure you update the image name in the constants file
- Install the dependencies using `npm install`
- Start the receiver by running `node queue/receiver.js`
- Start the server by running `node routes.js`. This automatically starts the sender as well

## Architecture of the backend
![architecture](https://github.com/Adithya2907/peetcode-poller/assets/56926966/900389e5-c4d3-4d4d-a916-03dc7d3375ad)

## Demo
https://drive.google.com/file/d/1W8-NYOTXS6uGbvWGZREf47JRRI1RS-7y/view?usp=sharing
