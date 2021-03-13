/**
 * Factory representing a list of attributes.
 *
 * @function Attributes
 * @param {Object=} attributes Attributes to build attribute collection from.
 */
export default function Attributes (attributes = {}) {
    // Private members.
    const _ = {
        // Deep copy attributes.
        // TODO Use Object.entries right away.
        attributes: Object.assign({}, attributes)
    }

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the attributes.
     *
     * @method toString
     * @memberOf Attributes
     * @return {string} String representation of the attributes.
     */
    /* test-code */
    api.toString = () => `Attributes{${Object.keys(_.attributes)
        .sort()
        .map(key => `${key}: "${_.attributes[key]}"`)
        .join(', ')}}`
    /* end-test-code */

    // TODO Docstring.
    api.size = () => Object.keys(_.attributes).length

    /**
     * Returns the raw object representing the attributes.
     *
     * @method _get
     * @memberOf Attributes
     * @return {Object} Object representing the attributes.
     * @protected
     */
    api._get = () => _.attributes

    /**
     * Assigns the attributes to a D3 selection.
     *
     * @method apply
     * @memberOf Attributes
     * @param {Object} selection D3 selection to assign attributes to.
     * @return {Object} D3 selection with the attributes applied.
     */
    api.apply = selection => {
        Object.entries(_.attributes).forEach(([key, value]) => selection.attr(key, value))
        return selection
    }

    /**
     * Returns an attributes object representing the attributes changes needed to arrive at another attributes object.
     *
     * @method diffTo
     * @memberOf Attributes
     * @param {Attributes} attr Attributes to calculate changes to.
     * @return {Attributes} The attributes object representing the required changes.
     */
    api.diffTo = attr => Attributes(
        Object.entries(attr._get())
            .reduce((diff, [key, value]) => {
                if (value !== _.attributes[key]) {
                    diff[key] = value
                }
                return diff
            }, {})
    )

    /**
     * Filters attributes by a selection to keep those that are different from the selection's current attributes.
     *
     * @method filter
     * @memberOf Attributes
     * @param {Object} selection D3 selection to filter by.
     * @return {Attributes} Attributes representing the attributes different from the selection's.
     */
    api.filter = selection => Attributes(
        Object.entries(_.attributes)
            .reduce((diff, [key, value]) => {
                if (value !== selection.attr(key)) {
                    diff[key] = value
                }
                return diff
            }, {})
    )

    // TODO Remove this.
    // TODO Separate selection parameter in other method.
    /**
     * @deprecated Use diffTo and filter
     */
    api.diff = (other, selection) => Attributes(
        Object.entries(other._get())
            .reduce((acc, [key, value]) => {
                if (value !== _.attributes[key] || value !== selection.attr(key))
                    acc[key] = value
                return acc
            }, {})
    )

    return api
}
