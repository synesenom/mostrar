export const TRANSITION_TYPES = {
    enter: 'enter',
    update: 'update',
    exit: 'exit'
}

export function Transition (entry) {
    const _ = {
        // TODO Make this Attributes.
        attr: entry.attr || {},
        // TODO Make this Style.
        style: entry.style || {},
        delay: entry.delay || 0,
        duration: entry.duration || 0,
        selector: entry.selector || []
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        _
    }
    /* end-test-code */

    // TODO Remove this.
    api.GET = () => entry

    api.includes = selectors => {
        const s = new Set(selectors || [])
        return _.selector.filter(d => s.has(d)).length > 0
    }

    // TODO Return Attributes.
    api.getAttributes = () => _.attr

    // TODO Return Style.
    api.getStyle = () => _.style

    api.getDelay = () => _.delay

    api.getDuration = () => _.duration

    return api
}
