import { Transition } from './transition'

/**
 * Factory representing a collection of transitions: this encapsulates the full transition from one frame to another.
 *
 * @function TransitionCollection
 * @param {Object[]=} options Array of objects representing the transition options.
 * @param {string=} type Type of the transition collection.
 */
export default function TransitionCollection (options = [], type) {
    // Private members.
    const _ = {
        // TODO Remove invalid/empty transitions.
        transitions: options.map(Transition)
    }

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the transition collection.
     *
     * @method toString
     * @memberOf TransitionCollection
     * @return {string} String representation of the transition collection.
     */
    api.toString = () => `TransitionCollection[${_.transitions.map(d => d.toString()).join(', ')}]`

    /**
     * Returns the number of transitions in the collection.
     *
     * @method size
     * @memberOf TransitionCollection
     * @return {number} Number of transitions in the collection.
     */
    api.size = () => _.transitions.length

    /*
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
     */

    return api
}
