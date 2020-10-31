import { Transition } from './transition'
import TransitionCollection from "./transition-collection";

const TRANSITION_TYPES = {
    enter: 'enter',
    update: 'update',
    exit: 'exit'
}

export default function Frame (frame) {
    const _ = {
        enter: frame.enter || [],
        exit: frame.exit || [],
        update: frame.update || []
    }

    function getUpdates (selector) {
        // TODO Return TransitionCollection
        return _.update.map(Transition)
            .filter(d => d.includes(selector))
            .map(d => d.GET())
    }

    function getEnters (selector) {
        // TODO Return TransitionCollection
        return _.enter.map(Transition)
            .filter(d => d.includes(selector))
            .map(d => d.GET())
    }

    function getExits (selector) {
        // TODO Return TransitionCollection
        return _.exit.map(Transition)
            .filter(d => d.includes(selector))
            .map(d => d.GET())
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        getUpdates,
        getEnters,
        getExits
    }
    /* end-test-code */

    api.getRelevantEntries = selector => {
        // Priority of transitions: enter, update, exit.

        // Enter.
        let entries = getEnters(selector)
        if (entries.length > 0) {
            return TransitionCollection(entries, TRANSITION_TYPES.enter)
        }

        // Update.
        entries = getUpdates(selector)
        if (entries.length > 0) {
            return TransitionCollection(entries, TRANSITION_TYPES.update)
        }

        // Exit.
        entries = getExits(selector)
        if (entries.length > 0) {
            return TransitionCollection(entries, TRANSITION_TYPES.exit)
        }

        // Otherwise return empty transition collection.
        return TransitionCollection()
    }

    return api
}
