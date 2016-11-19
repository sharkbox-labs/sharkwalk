# Project Name

> 'Jellywave' is the codename for a safe walk app. The app will
integrate mapping with crime data to help walkers find a safe path to their destinations.

## Team

  - __Product Owner__: Ker Moua
  - __Scrum Master__: David Walsh
  - __Development Team Members__: Mike Stromberg, Analisa Heilmann

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

> Safe walk is designed using a service-oriented architecture. To use the app locally for
development, [install the dependencies](#installing-dependencies) for each service.

To set up the Risk Assessment service, first ensure the environment variables specified in
`riskService/.example-env` are set in your environment. You may do this by manually setting them,
or by duplicating `riskService/example.env` to `.env` and filling
in the values there. (Note the service should still work without an API key for the San Francisco
Open Data, as long as the shared quota for requests without a key has not been reached for the
moment.) Next, in a separate tab, start MongoDB using the `mongod` command.
To populate the database with crime risk data, run the one-time worker for Downtown San Francisco
by executing `node riskService/assessmentWorker/workerDowntownSFScript.js`. Lastly, start the
service witn `node riskService/server.js`.

To set up the Trip service, set the environmental variables in `tripServer/example.env` the same
way you did with the Risk Assessment service, then run `node tripServer/server.js`.

From there, build the React client by `cd`ing into the `client` directory and running
`npm build`.

Lastly, `cd` into the `integrationServer` directory and run `npm start`.

The app should now be live at [http://localhost:3000](http://localhost:3000)
in your browser! 

## Requirements

- Node 6.7.0

## Development

### Installing Dependencies

From within **each** folder in the root directory:

```sh
npm install
```

### Backlog

View the project backlog [here](https://waffle.io/sharkbox-labs/jellywave)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
