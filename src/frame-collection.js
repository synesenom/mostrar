import TransitionCollection from './transition-collection'
import Frame from './frame'

export default function FrameCollection (frames) {
    let api = {}

    api.getTransitions = () => TransitionCollection(
        frames.map(d => d.update)
            .concat(frames.map(d => d.enter))
            .concat(frames.map(d => d.exit))
            .filter(d => typeof d !== 'undefined')
            .flat()
    )

    api.getFrames = () => frames.map(Frame)

    return api
}
