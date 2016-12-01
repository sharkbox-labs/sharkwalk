# Shark Walk

<img src='readme/shark.png' />

> 'Jellywave' is the codename for Shark Walk. The app integrates
mapping with crime data to help walkers find a safe path to their destinations.

## Team

  - __Product Owner__: [Ker Moua](https://github.com/kmoua92)
  - __Scrum Master__: [David Walsh](https://github.com/rhinodavid)
  - __Development Team Members__: [Mike Stromberg](https://github.com/mjstromberg), [Analisa Heilmann](https://github.com/anaheilmann)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
    1. [Tech Stack](#techstack)
1. [Team](#team)
1. [Contributing](#contributing)

## Usage

Go to [shark-walk.com](http://shark-walk.com) to start using the application.

The application was developed and tested to be used from a mobile device, as well as on a desktop or laptop.

Safe walk is designed using a service-oriented architecture. To use the app locally for
development, [install the dependencies](#installing-dependencies) for each service.

To set up the Risk Assessment service, first `cd` into the `/riskService` directory.
Ensure the environment variables specified in `.example-env` are set in your environment.
You may do this by manually setting them, or by duplicating `riskService/example.env` to `.env`
and filling in the values there. (Note the service should still work without an API key for the San Francisco
Open Data, as long as the shared quota for requests without a key has not been reached for the
moment. If you don't have an API key, delete `SF_CRIME_APP_TOKEN` and `SF_CRIME_SECRET` from the
`.env` file.) Next, in a separate tab, start MongoDB using the `mongod` command.
To populate the database with crime risk data, run the one-time worker for Downtown San Francisco
by executing `node assessmentWorker/workerDowntownSFScript.js`. Lastly, start the
service with `npm start`.

To set up the Trip service, open a new tab and `cd` into the `/tripService` directory.
Set the environment variables in `example.env` the same way you did with the Risk Assessment service,
then run `npm start`.

From there, build the React client by `cd`ing into the `/client` directory and running
`npm start`.

The app will now be live at [http://localhost:3000](http://localhost:3000)
in your browser!

## Requirements

- Node 6.7.0

## Development

### Installing Dependencies

Install NPM modules in the **root** directory, then within each service's
folder (`/riskService`, `/tripService`, and `/client`) by executing:

```sh
npm install
```

from within each directory.

### Backlog

View the project backlog [here](https://waffle.io/sharkbox-labs/jellywave)

### Tech Stack

The application was built using the MongoDB, Express, React/Redux, Node (MERN) stack, and incorporate the following technologies:
- [SF Open Data API](https://data.sfgov.org/developers)
- Google Maps API
- Docker


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
