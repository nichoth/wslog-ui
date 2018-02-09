var h = require('picodom').h
var S = require('pull-stream')
var _ = require('pull-stream-util')
var xtend = require('xtend')
var pushable = require('pull-pushable')
var render = require('pico-stream')

var state = { sessions: {}, sorted: [] }
var app = render(App, ['foo'], state, document.getElementById('app'))
var msgs$ = pushable()

S(
    S( msgs$,
        S.map(msg => JSON.parse(msg)),
        _.scan(function (state, msg) {
            var i = msg[0]
            var content = msg[1]
            var _sessions = {}
            _sessions[i] = (state.sessions[i] || []).concat([content])
            return xtend(state, {
                sessions: xtend(state.sessions, _sessions)
            })
        }, state)
    ),
    app.sink
)

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

function App (props) {
    return h('div', {}, [
        h('h2', {}, 'Messages'),
        Object.keys(props.sessions).reverse().map(function (k) {
            return [
                h('h3', {}, ['session ' + k]),
                h('ul', {}, props.sessions[k].map(function (msg, i) {
                    return h('li', {
                        key: i,
                        style: { whiteSpace: 'nowrap' }
                    }, [
                        h('code', {}, [JSON.stringify(msg)])
                    ])
                }))
            ]
        })
    ])
}






