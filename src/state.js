import { TRANSITION_TYPES } from './transition'
import Style from './style'
import Attributes from './attributes'
/* test-code */
import stringify from 'json-stable-stringify'
/* end-test-code */

export default function State (state) {
    const _ = {
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
