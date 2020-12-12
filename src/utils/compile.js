// TODO Documentation.
function replaceTag (el, tagName, classes, style) {
    const replacement = document.createElement(tagName)

    // Copy attributes.
    for (let i = 0; i < el.attributes.length; i++) {
        replacement.setAttribute(
            el.attributes.item(i).nodeName,
            el.attributes.item(i).nodeValue
        )
    }

    // Add classes (optional).
    if (Array.isArray(classes)) {
        replacement.classList.add(...classes)
    }

    // Add styles (optional).
    if (typeof style === 'object') {
        Object.entries(style)
            .forEach(([name, value]) => {
                replacement.style.setProperty(name, value)
            })
    }

    // Copy content.
    replacement.innerHTML = el.innerHTML

    // Replace element.
    el.parentNode.replaceChild(replacement, el)
}

// TODO Documentation.
export default function (tagFrom, tagTo, classes, style) {
    // Replace every tag recursively. The while loop is needed as the
    // replacement of a parent node will remove any previous reference to
    // its children.
    let el = document.querySelector(tagFrom)
    while (el !== null) {
        replaceTag(el, tagTo, classes, style)
        el = document.querySelector(tagFrom)
    }
}
