const zod = require('zod');

const user_structure = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6),
});

module.exports = { user_structure:user_structure };