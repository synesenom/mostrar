export default function (state) {
    const _ = {
        state
    }

    let api = {}

    api.GET = () => state

    return api
}
