const now = new Date().getTime();

const generateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: now
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: now
    }
}

module.exports = { generateMessage, generateLocationMessage };