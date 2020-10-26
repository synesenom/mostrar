const duration = 700

const Frames = [{
    id: 0,
    update: [{
        selector: ['.obj'],
        duration
    }]
}, {
    id: 1,
    update: [{
        selector: ['#update-single-1'],
        duration,
        attr: {
            r: 30
        },
        style: {
            fill: 'firebrick'
        }
    }]
}, {
    id: 2,
    update: [{
        selector: ['#update-multiple-1'],
        duration: duration / 2,
        attr: {
            r: 30
        },
        style: {
            fill: 'firebrick'
        }
    }, {
        selector: ['#update-multiple-2'],
        duration,
        attr: {
            r: 10
        },
        style: {
            fill: 'firebrick'
        }
    }]
}, {
    id: 3,
    update: [{
        selector: ['#update-delay-1'],
        duration: 0.6 * duration,
        attr: {
            width: '60%'
        },
        style: {
            fill: 'firebrick'
        }
    }, {
        selector: ['#update-delay-2'],
        duration: 0.6 * duration,
        delay: 0.2 * duration,
        attr: {
            width: '60%'
        },
        style: {
            fill: 'firebrick'
        }
    }, {
        selector: ['#update-delay-3'],
        duration: 0.6 * duration,
        delay: 0.4 * duration,
        attr: {
            width: '60%'
        },
        style: {
            fill: 'firebrick'
        }
    }]
}, {
    id: 4,
    enter: [{
        selector: ['#enter-single-1'],
        duration,
        style: {
            opacity: 1
        }
    }]
}, {
    id: 5,
    enter: [{
        selector: ['#enter-multiple-1'],
        duration: duration / 2,
        style: {
            opacity: 1
        }
    }, {
        selector: ['#enter-multiple-2'],
        duration,
        style: {
            opacity: 1
        }
    }]
}, {
    id: 6,
    enter: [{
        selector: ['#enter-delay-1'],
        duration: 0.6 * duration,
        style: {
            opacity: 1
        }
    }, {
        selector: ['#enter-delay-2'],
        duration: 0.6 * duration,
        delay: 0.2 * duration,
        style: {
            opacity: 1
        }
    }, {
        selector: ['#enter-delay-3'],
        duration: 0.6 * duration,
        delay: 0.4 * duration,
        style: {
            opacity: 1
        }
    }]
}, {
    id: 7,
    exit: [{
        selector: ['#exit-single-1'],
        duration,
        style: {
            opacity: 0
        }
    }]
}, {
    id: 8,
    exit: [{
        selector: ['#exit-multiple-1'],
        duration: duration / 2,
        style: {
            opacity: 0
        }
    }, {
        selector: ['#exit-multiple-2'],
        duration,
        style: {
            opacity: 0
        }
    }]
}, {
    id: 6,
    exit: [{
        selector: ['#exit-delay-1'],
        duration: 0.6 * duration,
        style: {
            opacity: 0
        }
    }, {
        selector: ['#exit-delay-2'],
        duration: 0.6 * duration,
        delay: 0.2 * duration,
        style: {
            opacity: 0
        }
    }, {
        selector: ['#exit-delay-3'],
        duration: 0.6 * duration,
        delay: 0.4 * duration,
        style: {
            opacity: 0
        }
    }]
}]
