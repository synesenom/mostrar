/* test-code */
import stringify from 'json-stable-stringify'
/* end-test-code */

export default function Attributes (attributes) {
    const _ = {
        // Deep copy attributes.
        attributes: Object.assign({}, attributes)
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        toString: () => stringify(_.attributes)
    }
    /* end-test-code */

    api.get = () => _.attributes

    api.apply = selection => {
        Object.entries(_.attributes).forEach(([key, value]) => selection.attr(key, value))
        return selection
    }

    // TODO Separate selection parameter in other method.
    api.diff = (other, selection) => Attributes(
        Object.entries(other.get())
            .reduce((acc, [key, value]) => {
                if (value !== _.attributes[key] || value !== selection.attr(key))
                    acc[key] = value
                return acc
            }, {})
    )

    return api
}
