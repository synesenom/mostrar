import stringify from 'json-stable-stringify'

export default function Style (style) {
    const _ = {
        // Deep copy style.
        style: Object.assign({}, style)
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        toString: () => stringify(_.style)
    }
    /* end-test-code */

    api.get = () => _.style

    api.apply = selection => {
        Object.entries(_.style).forEach(([key, value]) => selection.style(key, value))
        return selection
    }

    // TODO Separate selection in other method.
    api.diff = (other, selection) => Style(
        Object.entries(other.get())
            .reduce((acc, [key, value]) => {
                if (value !== _.style[key] || value !== selection.style(key))
                    acc[key] = value
                return acc
            }, {})
    )

    return api
}
