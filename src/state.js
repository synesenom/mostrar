import stringify from 'json-stable-stringify'
import { TRANSITION_TYPES } from './transition'
import Style from './style'
import Attributes from './attributes'

export default function State (state) {
    const _ = {
        id: state.id,
        visible: state.visible,
        duration: state.duration || 0,
        delay: state.delay || 0,
        style: Style(state.style),
        attr: Attributes(state.attr)
    }

    const api = {}

    /* test-code */
    api.__test__ = {
        toString () {
            return stringify({
                id: _.id,
                visible: _.visible,
                duration: _.duration,
                delay: _.delay,
                style: _.style.get(),
                attr: _.attr.get()
            })
        }
    }
    /* end-test-code */

    api.getDuration = () => _.duration

    api.getDelay = () => _.delay

    api.getStyle = () => _.style

    api.getAttributes = () => _.attr

    api.getVisible = () => _.visible

    api.getTransitionType = newState => {
        if (!_.visible && newState.getVisible()) {
            return TRANSITION_TYPES.enter
        }

        if (_.visible && !newState.getVisible()) {
            return TRANSITION_TYPES.exit
        }

        if (_.visible && newState.getVisible()) {
            return TRANSITION_TYPES.update
        }
    }

    return api
}
