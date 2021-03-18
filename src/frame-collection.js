import Frame from './frame'

/**
 * Factory representing a collection of frames.
 *
 * @function FrameCollection
 * @param {Object[]=} frames Array of objects representing the frames.
 */
export default function FrameCollection (frames = []) {
    const _ = {
        frames: frames.map(Frame)
    }

    // Public methods.
    const api = {}

    /* test-code */
    api.toString = () => `FrameCollection[${_.frames.map(d => d.toString()).join(', ')}]`
    /* end-test-code */

    /**
     * Returns a sorted array containing all the attribute names that are affected for a specific array of selectors.
     *
     * @method collectAttributeNames
     * @memberOf FrameCollection
     * @param {string[]} selectors Array of selectors to collect attribute names for.
     * @return {string[]} Array containing the affected attribute names.
     */
    api.collectAttributeNames = selectors => _.frames
        .map(d => d.collectAttributeNames(selectors))
        .flat()
        .sort()

    /**
     * Returns a sorted array containing all the style names that are affected for a specific array of selectors.
     *
     * @method collectStyleNames
     * @memberOf FrameCollection
     * @param {string[]} selectors Array of selectors to collect style names for.
     * @return {string[]} Array containing the affected style names.
     */
    api.collectStyleNames = selectors => _.frames
        .map(d => d.collectStyleNames(selectors))
        .flat()
        .sort()

    api.filter = selectors => _.frames.filter(d => d.filter(selectors))

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
