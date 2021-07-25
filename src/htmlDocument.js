function htmlDocument() {
    var document = rootElement();

    return {
        document,
        render: document.render,
        findElementById: rootElement.findElementById,
    };

    function rootElement() {
        const html = createElement("html");
        const head = createElement("head");
        const body = createElement("body");

        html.append(head);
        html.append(body);

        const render = function () {
            return html.render();
        };

        return {
            head,
            body,
            render,
            findElementById: html.findElementById,
        };
    }
}

function createElement(tagName, id) {
    const isHtmlElement = true;
    const elementId = id || "";
    let children = [];
    let attributes = new Map();

    const addAttr = function (attrName, attrValue) {
        const currentValues = attributes.get(attrName) || [];
        if (currentValues.filter((value) => value === attrValue).length === 0) currentValues.push(attrValue);

        attributes.set(attrName, currentValues);
    };

    const append = function (element) {
        children.push(element);
    };

    const renderId = function () {
        return elementId && elementId.length > 0 ? ` id=${elementId}` : "";
    };

    const findElementById = function (id) {
        if (elementId === id) {
            return this;
        }

        for (const element of children) {
            if (element.isHtmlElement) {
                const result = element.findElementById(id);
                if (result) return result;
            }
        }

        return null;
    };

    const render = function () {
        const attributeList = [...attributes.entries()].map(([key, value]) => ` ${key}="${value.join(" ")}"`);
        const elementList = children.map((element) => (element && element.isHtmlElement ? element.render() : element)).join("");
        return `<${tagName}${renderId()}${attributeList}>${elementList}</${tagName}>`;
    };

    return {
        findElementById,
        isHtmlElement,
        addAttr,
        append,
        render,
    };
}

module.exports = {
    htmlDocument,
    createElement,
};
