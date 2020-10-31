import { max } from 'd3'
import { Transition } from './transition'

export default function TransitionCollection (entries, type) {
    const _ = {
        // TODO Remove invalid/empty transitions.
        transitions: (entries || []).map(Transition)
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        _
    }
    /* end-test-code */

    api.getType = () => type

    api.getAttributes = selection => {
        const attributes = _.transitions.map(d => d.getAttributes())
            .filter(d => typeof d !== 'undefined')
            .reduce((acc, d) => Object.assign(acc, d), {})

        if (typeof selection !== 'undefined') {
            Object.keys(attributes).forEach(key => {
                attributes[key] = selection.attr(key) || null
            })
        }

        return attributes
    }

    api.getStyle = selection => {
        const style = _.transitions.map(d => d.getStyle())
            .filter(d => typeof d !== 'undefined')
            .reduce((acc, d) => Object.assign(acc, d), {})

        if (typeof selection !== 'undefined') {
            Object.keys(style).forEach(key => {
                style[key] = selection.style(key) || null
            })
        }

        return style
    }

    api.getMaxDelay = () => max(_.transitions.map(d => d.getDelay())) || 0

    api.getMaxDuration = () => max(_.transitions.map(d => d.getDuration())) || 0

    return api
}
