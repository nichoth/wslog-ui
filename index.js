var WS = require('ws')

listen()

function listen () {
    var msgs = Msgs()
    msgs.push(JSON.stringify({ hello: 'world' }))
    var wsServer = new WS.Server({ port: 8123 })

    wsServer.on('connection', function (socket) {
        socket.on('message', function (msg) {
            msgs.push(msg)
            console.log('got msg', msg)
        })

        socket.on('close', function () {
            console.log('source close')
            // wsServer.close()
        })
    })

    var guiServer = new WS.Server({ port: 8124 })
    guiServer.on('connection', function (socket) {
        console.log('gui open')

        msgs.get().forEach(function (msg) {
            socket.send(msg)
        })

        msgs.onChange(msg => socket.send(msg))

        socket.on('message', function (msg) {
            console.log('gui msg', msg)
        })

        socket.on('error', function (err) {
            console.log('error', err)
        })

        socket.on('close', function () {
            console.log('gui close')
        })
    })
}

function Msgs () {
    var msgs = []
    var listeners = []

    return {
        push: function (data) {
            msgs.push(data)
            listeners.forEach(function (fn) {
                fn(data)
            })
        },

        onChange: function (fn) {
            listeners.push(fn)
            return function unsub () {
                listeners.splice(listeners.length - 1, 1)
            }
        },

        get: () => msgs
    }
}



