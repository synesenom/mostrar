/**
 * Factory representing a style list.
 *
 * @function Attributes
 * @param {Object=} style Style to build style collection from.
 */
export default function Style (style = {}) {
    // Private members.
    const _ = {
        // Deep copy style.
        style: Object.assign({}, style)
    }

    // Public methods.
    const api = {}

    /* end-test-code */
    api.toString = () => `Style{${Object.keys(_.style)
        .sort()
        .map(key => `${key}: "${_.style[key]}"`)
        .join(', ')}}`
    /* test-code */

    /**
     * Returns the number of style entries.
     *
     * @method size
     * @memberOf Style
     * @return {number} Number of style entries.
     */
    api.size = () => Object.keys(_.style).length

    /**
     * Returns the raw object representing the style.
     *
     * @method _get
     * @memberOf Style
     * @return {Object} Object representing the style.
     * @protected
     */
    api._get = () => _.style

    /**
     * Assigns the style to a D3 selection.
     *
     * @method apply
     * @memberOf Style
     * @param {Object} selection D3 selection to assign style to.
     * @return {Object} D3 selection with the style applied.
     */
    api.apply = selection => {
        Object.entries(_.style)
            .forEach(([key, value]) => selection.style(key, value))
        return selection
    }

    /**
     * Returns a style object representing the style changes needed to arrive at another style object.
     *
     * @method diffTo
     * @memberOf Style
     * @param {Style} style Style to calculate changes to.
     * @return {Style} The style object representing the required changes.
     */
    api.diffTo = style => Style(
        Object.entries(style._get())
            .reduce((diff, [key, value]) => {
                if (value !== _.style[key]) {
                    diff[key] = value
                }
                return diff
            }, {})
    )

    /**
     * Filters style by a selection to keep those that are different from the selection's current style.
     *
     * @method filter
     * @memberOf Style
     * @param {Object} selection D3 selection to filter by.
     * @return {Style} Style representing the style different from the selection's.
     */
    api.filter = selection => Style(
        Object.entries(_.style)
            .reduce((diff, [key, value]) => {
                if (value !== selection.style(key)) {
                    diff[key] = value
                }
                return diff
            }, {})
    )

    /**
     * Returns a sorted array of style names.
     *
     * @method names
     * @memberOf Style
     * @return {string[]} Array containing the style names.
     */
    api.names = () => Object.keys(_.style).sort()

    // TODO Separate selection in other method.
    /**
     * @deprecated Use diffTo and filter
     */
    api.diff = (other, selection) => Style(
        Object.entries(other._get())
            .reduce((acc, [key, value]) => {
                if (value !== _.style[key] || value !== selection.style(key))
                    acc[key] = value
                return acc
            }, {})
    )

    return api
}
