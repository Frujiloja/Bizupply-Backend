const { getUsersName } = require("../controllers/userControllers");

const getUsersNameHandler = async (req, res) => {
    const { name } = req.query;
    const response = await getUsersName(name);
    try {
        res.status(200).json(response)
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

module.exports = {getUsersNameHandler};