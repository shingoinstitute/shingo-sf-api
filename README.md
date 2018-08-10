# shingo-sf-api

Client library and grpc server for communicating with a salesforce instance

## Usage
### Server
1. Clone the repository and build with `npm run build`
2. Run with `npm start`

In the future we may have a npm bin install. At that point you can install the server with
`npm i -g @shingo/shingo-sf-api` and run `npx shingo-sf-api-server`
### Client
1. Install the library as a dependency `npm i --save-dev @shingo/shingo-sf-api`
2. Import the `SalesforceClient` class from the index and instantiate with the server address:
```ts
  import { SalesforceClient } from '@shingo/shingo-sf-api'
  const client = new SalesforceClient('api.shingo.org:1337')
  client.query({ fields: ['Id', 'Name'], table: 'Contact' }).then(res => {
    // do something
  })
```

