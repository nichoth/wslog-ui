var h = require('picodom').h
var xtend = require('xtend')

function ButtonIcon (props, children) {
    return h('button', xtend({
        class: 'button-icon'
    }, props), children)
}

function ButtonCopy (props) {
    return ButtonIcon(props, [
        h('i', { class: 'far fa-copy' }, [])
    ])
}

// {
//  sessions: {},
//  sorted: [],
//  grouped: { state: [], event: [] }
// }
function App (props) {
    // console.log('render', props)
    return h('div', {}, [
        h('h2', {}, 'Messages'),
        props.sorted.map(function (k) {
            return h('div', { class: 'session' }, [
                h('h3', {}, [
                    h('span', {}, ['session ' + k]),
                    ButtonCopy({
                        onclick: props.emit.copySession.bind(null, k),
                        title: 'Copy all session data to clipboard'
                    })
                ]),

                h('div', { class: 'session-data' }, [
                    h('div', { class: 'session-group' }, [
                        h('h4', {}, [
                            h('span', {}, ['Events']),
                            ButtonCopy({
                                onclick: props.emit.copyEvents.bind(null, k),
                                title: 'Copy these events to clipboard'
                            })
                        ]),
                        NodeList({ msgs: props.grouped[k].event })
                    ]),

                    h('div', { class: 'session-group' }, [
                        h('h4', {}, [
                            h('span', {}, ['States']),
                            ButtonCopy({
                                onclick: props.emit.copyStates.bind(null, k),
                                title: 'Copy these events to clipboard'
                            })
                        ]),
                        NodeList({ msgs: props.grouped[k].state })
                    ])
                ])
            ])
        })
    ])
}

function NodeList (props) {
    return h('ul', {}, props.msgs.map(function (msg, i) {
        return h('li', {
            key: i,
            style: { whiteSpace: 'nowrap' }
        }, [
            h('code', {}, [JSON.stringify(msg)])
        ])
    }))
}

module.exports = App

