const users = []

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase()

    // Validate the data
    if (!username || !room ) {
        return {
            error: 'Username and room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate username
    if (existingUser) {
        return {
            error: 'Username is in use'
        }
    }

    // Store user
    const user = { id, username, room }
    users.push(user)
    return { user }
};

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const getUser = (id) => {
   return users.filter((user) => user.id === id)[0];
};

const getUsersInRoom = (room) => {
    return users.filter((user) => user.room === room.trim().toLowerCase());
};

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}