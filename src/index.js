var h = require('picodom').h
var S = require('pull-stream')
var _ = require('pull-stream-util')
var xtend = require('xtend')
var pushable = require('pull-pushable')
var render = require('pico-stream')

var state = { msgs: [] }
var app = render(App, ['foo'], state, document.getElementById('app'))
var msgs$ = pushable()

S(
    msgs$,
    _.scan(function (state, msg) {
        return xtend(state, { msgs: state.msgs.concat([msg]) })
    }, state),
    app.sink
)

var URL = 'ws://localhost:8124'
var socket = new window.WebSocket(URL)

socket.addEventListener('message', function (ev) {
    msgs$.push(ev.data)
    console.log('Message from server ', ev.data)
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
        h('ul', {}, props.msgs.map(function (msg, i) {
            return h('li', {
                key: i,
                style: { whiteSpace: 'nowrap' }
            }, [
                h('code', {}, [msg])
            ])
        }))
    ])
}






