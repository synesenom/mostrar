import { TRANSITION_TYPES } from './transition'
import TransitionCollection from "./transition-collection";


/**
 * Factory representing a single frame. The frame contains transition collections for each transition type.
 *
 * @function Frame
 * @param {Object} config Frame configuration. May have properties enter, exit or update.
 * @param {number} index Frame index.
 */
export default function Frame (config, index) {
    const _ = {
        index,
        name: config.name,
        enter: TransitionCollection(config.enter, TRANSITION_TYPES.enter),
        update: TransitionCollection(config.update, TRANSITION_TYPES.update),
        exit: TransitionCollection(config.exit, TRANSITION_TYPES.exit)
    }

    /*
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
     */

    const api = {}

    /* test-code */
    api.toString = () => {
        const entries = [`index: ${_.index}`]

        if (typeof _.name !== 'undefined') {
            entries.push(`name: "${_.name}"`)
        }

        if (_.enter.size() > 0) {
            entries.push(`enter: ${_.enter.toString()}`)
        }

        if (_.update.size() > 0) {
            entries.push(`update: ${_.update.toString()}`)
        }

        if (_.exit.size() > 0) {
            entries.push(`exit: ${_.exit.toString()}`)
        }

        return `Frame{${entries.join(', ')}}`
    }
    /* end-test-code */

    /**
     * Collects all attribute names for some selectors.
     *
     * @method collectAttributeNames
     * @memberOf Frame
     * @param {string[]} selectors Array of selectors to collect attribute names for.
     * @return {string[]} Array containing the attribute names.
     */
    api.collectAttributeNames = selectors => [
        ..._.enter.collectAttributeNames(selectors),
        ..._.update.collectAttributeNames(selectors),
        ..._.exit.collectAttributeNames(selectors)
    ].sort()

    /**
     * Collects all style names for some selectors.
     *
     * @method collectStyleNames
     * @memberOf Frame
     * @param {string[]} selectors Array of selectors to collect style names for.
     * @return {string[]} Array containing the style names.
     */
    api.collectStyleNames = selectors => [
        ..._.enter.collectStyleNames(selectors),
        ..._.update.collectStyleNames(selectors),
        ..._.exit.collectStyleNames(selectors)
    ].sort()

    /*
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
     */

    return api
}
