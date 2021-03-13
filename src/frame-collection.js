import Frame from './frame'

/**
 * Factory representing a collection of frames.
 *
 * @function FrameCollection
 * @param {Object[]=} frames Array of objects representing the frames.
 */
// TODO Save slide IDs also.
export default function FrameCollection (frames = []) {
    const _ = {
        frames: frames.map(Frame)
    }

    // Public methods.
    const api = {}

    /**
     * Returns the string representation of the frame collection.
     *
     * @method toString
     * @memberOf FrameCollection
     * @return {string} String representation of the frame collection.
     */
    api.toString = () => `FrameCollection[${_.frames.map(d => d.toString()).join(', ')}]`

    /*
    api.getTransitions = () => TransitionCollection(
        frames.map(d => d.update)
            .concat(frames.map(d => d.enter))
            .concat(frames.map(d => d.exit))
            .filter(d => typeof d !== 'undefined')
            .flat()
    )

    api.getFrames = () => frames.map(Frame)
     */

    return api
}
