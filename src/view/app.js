var h = require('picodom').h
var xtend = require('xtend')

function ButtonIcon (props, children) {
    return h('button', xtend({
        class: 'button-icon'
    }, props), children)
}

// {
//  sessions: {}
//  sorted: []
// }
function App (props) {
    return h('div', {}, [
        h('h2', {}, 'Messages'),
        props.sorted.map(function (k) {
            return [
                h('h3', {}, [
                    h('span', {}, ['session ' + k]),
                    ButtonIcon({
                        onclick: props.emit.copySession.bind(null, k),
                        title: 'copy all session data to clipboard'
                    }, [
                        h('i', { class: 'far fa-copy' }, [])
                    ])
                ]),
                h('ol', { reversed: true }, props.sessions[k]
                    .map(function (msg, i) {
                        return h('li', {
                            key: i,
                            style: { whiteSpace: 'nowrap' }
                        }, [
                            h('code', {}, [JSON.stringify(msg)])
                        ])
                    })
                )
            ]
        })
    ])
}

module.exports = App

