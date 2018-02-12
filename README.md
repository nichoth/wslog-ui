# wslog ui

WIP

## develop

Start the front end:

    $ npm start

--------------------------

Start the backend:

    $ node index.js 

---------------------------

Then run a wslog client in another process, and the server will receive events from it.

```js
require('@nichoth/wslog/client')().event('foo', { hello: 'world' })
```

