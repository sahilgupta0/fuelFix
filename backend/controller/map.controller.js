// const mapService = require('../services/map.services');


// import getAddressCoordinates from '../services/map.services.js';
const mapService = require('../services/map.services');

module.exports.getCoordinates = async (req, res) => {
    const { address } = req.query;
    try {
        const coordinates = await mapService.getAddressCoordinates(address);
        res.status(200).json({
            status: 'success',
            data: {
                coordinates
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    } 
}

module.exports.getDistaceTime = async (req, res) => {
    const { origin, destination } = req.query;
    try {
        const distanceTime = await mapService.getDistanceTime(origin, destination);
        res.status(200).json( distanceTime );
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    } 
}

module.exports.getSuggestions = async (req, res) => {
    const { input } = req.query;
    try {
        const suggestions = await mapService.getSuggestions(input);
        res.status(200).json({
            status: 'success',
            data: {
                suggestions
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: error.message
        });
    } 
}