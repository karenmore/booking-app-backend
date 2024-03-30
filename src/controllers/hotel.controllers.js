const catchError = require('../utils/catchError');
const Hotel = require('../models/Hotel');
const City = require('../models/City');
const Image = require('../models/Image')
const { Op } = require('sequelize');
const Review = require('../models/Review');

const getAll = catchError(async(req, res) => {
    const { cityId, name } = req.query

    const where = {}
    if(cityId) where.cityId = cityId
    if(name) where.name = { [Op.iLike]: `%${name}%` }

    const results = await Hotel.findAll({ 
        include: [ City, Image, Review],
        where: where,
        
     });
     const hotelsWithRating = results.map( hotel => {
        //console.log(hotel.toJSON());
        const hotelJson = hotel.toJSON();
        let sum = 0;
        //console.log(reviewsJson.reviews);
        hotelJson.reviews.forEach(reviews => {
            //console.log(review.rating);
            sum += reviews.rating
            //console.log(sum); 
        });
        const reviewsCount = hotelJson.reviews.length;
        const average = reviewsCount > 0 ? sum / hotelJson.reviews.length : 0;
        //console.log(average)
        delete hotelJson.reviews;
        return {...hotelJson, rating: average}

     } )
    return res.json(hotelsWithRating);
});

const create = catchError(async(req, res) => {
    const result = await Hotel.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.findByPk(id, { include: [City, Image, Review] });
    if(!result) return res.sendStatus(404);

    const hotelJson = result.toJSON();
    let sum = 0;
    hotelJson.reviews.forEach(reviews => {
        sum += reviews.rating
    });
    const reviewsCount = hotelJson.reviews.length;
    const average = reviewsCount > 0 ? sum / hotelJson.reviews.length : 0;
    delete hotelJson.reviews;
    return res.json({...hotelJson, rating: average})
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Hotel.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Hotel.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update
}