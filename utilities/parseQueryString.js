import decodeComponent from 'decode-uri-component';

function keysSorter(input) {
    if (Array.isArray(input)) {
        return input.sort();
    }

    if (typeof input === 'object') {
        return keysSorter(Object.keys(input))
            .sort((a, b) => Number(a) - Number(b))
            .map(key => input[key]);
    }

    return input;
}

function decode(value, options) {
    if (options.decode) {
        return decodeComponent(value);
    }

    return value;
}

function parserForArrayFormat(options) {
    let result;

    switch (options.arrayFormat) {
        case 'index':
            return (key, value, accumulator) => {
                result = /\[(\d*)\]$/.exec(key);

                key = key.replace(/\[\d*\]$/, '');

                if (!result) {
                    accumulator[key] = value;
                    return;
                }

                if (accumulator[key] === undefined) {
                    accumulator[key] = {};
                }

                accumulator[key][result[1]] = value;
            };
        case 'bracket':
            return (key, value, accumulator) => {
                result = /(\[\])$/.exec(key);
                key = key.replace(/\[\]$/, '');

                if (!result) {
                    accumulator[key] = value;
                    return;
                }

                if (accumulator[key] === undefined) {
                    accumulator[key] = [value];
                    return;
                }

                accumulator[key] = [].concat(accumulator[key], value);
            };
        default:
            return (key, value, accumulator) => {
                if (accumulator[key] === undefined) {
                    accumulator[key] = value;
                    return;
                }

                accumulator[key] = [].concat(accumulator[key], value);
            };
    }
}

export default (input, options) => {
    options = Object.assign({decode: true, arrayFormat: 'none'}, options);

    const formatter = parserForArrayFormat(options);

    // Create an object with no prototype
    const ret = Object.create(null);

    if (typeof input !== 'string') {
        return ret;
    }

    input = input.trim().replace(/^[?#&]/, '');

    if (!input) {
        return ret;
    }

    for (const param of input.split('&')) {
        let [key, value] = param.replace(/\+/g, ' ').split('=');

        // Missing `=` should be `null`:
        // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
        value = value === undefined ? null : decode(value, options);

        formatter(decode(key, options), value, ret);
    }

    return Object.keys(ret).sort().reduce((result, key) => {
        const value = ret[key];
        if (Boolean(value) && typeof value === 'object' && !Array.isArray(value)) {
            // Sort object keys, not values
            result[key] = keysSorter(value);
        } else {
            result[key] = value;
        }

        return result;
    }, Object.create(null));
}