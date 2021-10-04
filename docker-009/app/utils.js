function buildUrl(...urls) {
    return urls.join('');
}

function errorCreator(code) {
    return {
        code,
        message: `Code: ${code}`
    }
}

module.exports = {
    buildUrl,
    errorCreator
}