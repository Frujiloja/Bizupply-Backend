const {createRating, getAllRatings, getRatingsById, getRatingsAverage, getRatingsByUser} = require('../controllers/ratingControllers');

const createRatingHandler = async (req, res) => {
    try {
        const {userId, productId, rate, review} = req.body;
        const rating = await createRating(userId, productId, rate, review)
        res.status(200).json(rating);

    } catch (error) {
        res.status(400).json({error:error.message}); 
    }
};

const getRatingsHandler = async (req, res) => {
    try {
        const allRatings = await getAllRatings();
        
        res.status(200).json(allRatings);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

const getRatingByIdHandler = async (req, res) => {
    const {productId} = req.params;

    try {
        const ratings = await getRatingsById(productId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(400).json({error:error.message});
    }

};

const ratingsAverageHandler = async (req, res) => {
    try {
        const averages = await getRatingsAverage();
        res.status(200).json(averages);
    } catch (error) {
        res.status(400).json({error:error.message});
    }
};

const getRatingsByUserHandler = async (req, res) => {
    try {
        const {userId} = req.params;
        const ratings = await getRatingsByUser(userId);
        res.status(200).json(ratings);
    } catch (error) {
        res.status(400).json({error: error.message});
    }

};

module.exports = {createRatingHandler, getRatingsHandler, getRatingByIdHandler, ratingsAverageHandler, getRatingsByUserHandler};