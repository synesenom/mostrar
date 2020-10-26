import { select, max } from 'd3'
import extractSelectors from './utils/extract-selectors'
import State from './state'

// TODO Separate frames manipulation methods in a FrameCollection class.
// TODO Separate frame manipulation methods in a Frame class.
// TODO Separate entries manipulation methods in a Entries class.
// TODO Separate transition manipulation methods in an Entry class
// TODO Add support for transition sequence.

export default function (node) {
    // Constants.
    const TRANSITION_TYPES = {
        enter: 'enter',
        update: 'update',
        exit: 'exit'
    }

    // Private members.
    const _ = {
        id: node.id,
        selection: select(node),
        selectors: new Set(extractSelectors(node)),
        states: []
    }

    // TODO Move this to the Transition class.
    function includes (selector) {
        return selector.filter(d => _.selectors.has(d)).length > 0
    }

    // TODO Move this to the Frames class.
    function getTransitions (frames) {
        return frames.map(d => d.update)
            .concat(frames.map(d => d.enter))
            .concat(frames.map(d => d.exit))
            .filter(d => typeof d !== 'undefined')
            .flat()
    }

    function initProperties (props, type) {
        Object.keys(props).forEach(key => {
            props[key] = _.selection[type](key) || null
        })

        return props
    }

    function getMaxDuration (entries) {
        return max((entries || []).map(d => d.duration || 0).concat(0))
    }

    function getMaxDelay (entries) {
        return max((entries || []).map(d => d.delay || 0).concat(0))
    }

    function getAttributes (entries) {
        return entries.map(d => d.attr)
            .filter(d => typeof d !== 'undefined')
            .reduce((acc, d) => Object.assign(acc, d), {})
    }

    function getStyle (entries) {
        return entries.map(d => d.style)
            .filter(d => typeof d !== 'undefined')
            .reduce((acc, d) => Object.assign(acc, d), {})
    }

    function computeAttributeDiff (before, after) {
        // TODO Simplify this.
        const attributes = {}
        for (const key in before) {
            // TODO Change these to maps from raw object.s
            if (before.hasOwnProperty(key) && after.hasOwnProperty(key)
                && (before[key] !== after[key] || _.selection.attr(key) !== after[key])) {
                attributes[key] = after[key]
            }
        }
        return attributes
    }

    function computeStyleDiff (before, after) {
        // TODO Simplify this.
        const style = {}
        for (const key in before) {
            // TODO Change these to maps from raw object.s
            if (before.hasOwnProperty(key) && after.hasOwnProperty(key)
                && (before[key] !== after[key] || _.selection.style(key) !== after[key])) {
                style[key] = after[key]
            }
        }
        return style
    }

    function getUpdates (frame) {
        return (frame.update || []).filter(d => includes(d.selector))
    }

    function getEnters (frame) {
        return (frame.enter || []).filter(d => includes(d.selector))
    }

    function getExits (frame) {
        return (frame.exit || []).filter(d => includes(d.selector))
    }

    function getRelevantEntries (frame) {
        // Priority of transitions: enter, update, exit.

        // Enter.
        let entries = getEnters(frame)
        if (entries.length > 0) {
            return {entries, type: TRANSITION_TYPES.enter}
        }

        // Update.
        entries = getUpdates(frame)
        if (entries.length > 0) {
            return {entries, type: TRANSITION_TYPES.update}
        }

        // Exit.
        entries = getExits(frame)
        if (entries.length > 0) {
            return {entries, type: TRANSITION_TYPES.exit}
        }

        return {}
    }

    function determineTransition (visibleBefore, visibleAfter) {
        // TODO Make State class.
        if (!visibleBefore && visibleAfter) {
            return TRANSITION_TYPES.enter
        }

        if (visibleBefore && !visibleAfter) {
            return TRANSITION_TYPES.exit
        }

        if (visibleBefore && visibleAfter) {
            return TRANSITION_TYPES.update
        }
    }

    function setStyle(selection, styles) {
        Object.entries(styles).forEach(([key, value]) => selection.style(key, value))
        return selection
    }

    function setAttributes(selection, attributes) {
        Object.entries(attributes).forEach(([key, value]) => selection.attr(key, value))
        return selection
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        TRANSITION_TYPES,
        _,
        computeAttributeDiff,
        computeStyleDiff,
        determineTransition,
        includes,
        initProperties,
        getAttributes,
        getEnters,
        getExits,
        getMaxDelay,
        getMaxDuration,
        getRelevantEntries,
        getStyle,
        getTransitions,
        getUpdates,
        setStyle,
        setAttributes
    }
    /* end-test-code */

    api.init = frames => {
        // Build initial style and attributes.
        let visible = _.selection.style('display') !== 'none'
        const entries = getTransitions(frames)
        const currentStyle = initProperties(getStyle(entries), 'style')
        const currentAttr = initProperties(getAttributes(entries), 'attr')
        _.states.push(State({
            id: 0,
            visible,
            duration: 0,
            delay: 0,
            style: Object.assign({}, currentStyle),
            attr: Object.assign({}, currentAttr)
        }))

        // Build historical frame setStyle.
        frames.forEach(frame => {
            const {entries, type} = getRelevantEntries(frame)

            if (typeof entries !== 'undefined') {
                Object.assign(currentStyle, getStyle(entries))
                Object.assign(currentAttr, getAttributes(entries))
            }

            switch (type) {
                case TRANSITION_TYPES.enter:
                    visible = true
                    break
                case TRANSITION_TYPES.exit:
                    visible = false
                    break
            }

            // Add state for frame.
            _.states.push(State({
                id: frame.id,
                visible,
                duration: getMaxDuration(entries),
                delay: getMaxDelay(entries),
                style: Object.assign({}, currentStyle),
                attr: Object.assign({}, currentAttr)
            }))
        })

        return api
    }

    api.toFrame = (before, after) => {
        // Determine transition type (if any), duration and delay.
        const type = determineTransition(_.states[before].GET().visible, _.states[after].GET().visible)
        const duration = _.states[after].GET().duration || _.states[before].GET().duration
        const delay = _.states[after].GET().delay || _.states[before].GET().delay

        switch (type) {
            case TRANSITION_TYPES.enter: {
                const s = setStyle(_.selection, _.states[before].GET().style)
                    .style('display', null)
                const t = s.interrupt().transition().duration(duration).delay(delay)
                setStyle(t, _.states[after].GET().style)
                setAttributes(t, _.states[after].GET().attr)
                break
            }

            default:
            case TRANSITION_TYPES.update: {
                const t = typeof type === 'undefined' ? _.selection : _.selection.interrupt().transition().duration(duration).delay(delay)
                setStyle(t, computeStyleDiff(_.states[before].GET().style, _.states[after].GET().style))
                setAttributes(t, computeAttributeDiff(_.states[before].GET().attr, _.states[after].GET().attr))
                break
            }

            case TRANSITION_TYPES.exit: {
                const t = _.selection.interrupt().transition().duration(duration).delay(delay)
                setStyle(t, _.states[after].GET().style)
                setAttributes(t, _.states[after].GET().attr)
                t.on('end', () => _.selection.style('display', 'none'))
                break
            }
        }

        return api
    }

    return api
}
