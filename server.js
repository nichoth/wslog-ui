var WS = require('ws')

listen()

function listen () {
    var session = 0
    var msgs = Msgs()
    var wsServer = new WS.Server({ port: 8123 })

    wsServer.on('connection', function (socket) {
        var i = session++
        console.log('source connect')
        socket.on('message', function (msg) {
            msgs.push(JSON.stringify([i, JSON.parse(msg)]))
            // console.log('got msg', msg)
        })

        socket.on('error', function (err) {
            console.log('source error', err)
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

        var unsub = msgs.onChange(msg => socket.send(msg))

        socket.on('message', function (msg) {
            // console.log('gui msg', msg)
        })

        socket.on('error', function (err) {
            unsub()
            console.log('error', err)
        })

        socket.on('close', function () {
            unsub()
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



