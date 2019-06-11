# node-jsonp-client

a simple jsonp client for Node.js

## Installation

```bash
$ npm install node-jsonp-client
```

## Usage

Include the library on Node.js

```javascript
const jsonpClient = require('node-jsonp-client')
const http = require('http')

jsonpClient('http://yourapi', {
  agent: new http.Agent({ keepAlive: true })
}).then(console.log)
```
