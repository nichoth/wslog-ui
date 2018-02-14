var S = require('pull-stream')
var _ = require('pull-stream-util')
// var r = require('ramda')
var xtend = require('xtend')
var pushable = require('pull-pushable')
var Notify = require('pull-notify')
var render = require('pico-stream')
var client = window.client = require('@nichoth/wslog/client')()
var App = require('./view/app')
var clipboardCopy = require('clipboard-copy')

// view events
var EVENTS = ['copySession', 'copyEvents', 'copyStates']

var state = { sessions: {}, sorted: [], grouped: {} }
var app = render(App, EVENTS, state, document.getElementById('app'))
var msgs$ = pushable()
var state$ = Notify()

S( msgs$,
    S.map(msg => JSON.parse(msg)),
    _.scan(function (state, msg) {
        var i = msg[0]
        var content = msg[1]
        var _sorted = [].concat(state.sorted)
        if (_sorted[0] !== i) _sorted.unshift(i)

        var _sessions = {}
        _sessions[i] = [].concat(state.sessions[i] || [])
        _sessions[i].push(content)

        var _grouped = {}
        _grouped[i] = _sessions[i].reduce(function (acc, ev) {
            var k = ev[0]
            acc[k] = acc[k].concat([ev[1]])
            return acc
        }, { state: [], event: [] })

        return xtend(state, {
            sessions: xtend(state.sessions, _sessions),
            sorted: _sorted,
            grouped: xtend(state.grouped, _grouped)
        })
    }, state),
    S.through(state$),
    // S.through(console.log.bind(console, 'render')),
    app.sink
)

// copy session as ndjson to clipboard
S(
    _.sample.toArray(state$.listen(), app.source.copySession()),
    S.map(([state, index]) => {
        return toNdJson(state.sessions[index].reverse())
    }),
    CopySink()
)

// copy events to clipboard

// copy states to clipboard

function toNdJson (ary) {
    return ary.reduce(function (acc, data) {
        return acc + JSON.stringify(data) + '\n'
    }, '')
}

function CopySink () {
    return S.drain(clipboardCopy, function onEnd (err) {
        if (err) console.warn('Error in copy stream', err)
    })
}

var URL = 'ws://localhost:8124'
var socket = new window.WebSocket(URL)

socket.addEventListener('message', function (ev) {
    msgs$.push(ev.data)
    // console.log('Message from server ', ev.data)
})

socket.addEventListener('open', function (ev) {
    console.log('open', ev)
})

socket.addEventListener('error', function (err) {
    console.log('error', err)
})

socket.addEventListener('close', function (ev) {
    console.log('close', ev)
})

client.state({ hello: 'woo' })
client.event(['update', { hello: 'world' }])
client.state({ hello: 'world' })





