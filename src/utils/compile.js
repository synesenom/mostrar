/**
 * Replaces an element with a tag.
 *
 * @method replaceTag
 * @param {Element} el Element to replace.
 * @param {string} tagName Tag to replace element with.
 * @param {string[]?} classes Array of string representing the classes to add to the new element.
 * @param {Object?} style Object representing the style to add to the new element.
 */
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

/**
 * Replaces all tags with a new tag.
 *
 * @method compile
 * @param {string} tagFrom Name of tag to replace.
 * @param {string} tagTo Name of tag to replace with.
 * @param {string[]?} classes List of classes to add to new tags.
 * @param {Object?} style Style to add to new tags.
 * @deprecated
 */
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
