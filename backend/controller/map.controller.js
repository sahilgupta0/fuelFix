// const mapService = require('../services/map.services');


// import getAddressCoordinates from '../services/map.services.js';
const Request = require('../models/Request'); 
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

module.exports.getDirections = async (req, res) => {
    const { source, requestId } = req.query;
    try {
        const destination  = await Request.findById(requestId).select('destination');

        // const destination = 'birgunj'
        console.log('Source:', source);
        console.log('Destination:', destination.destination);
        try {
            const directions = await mapService.getDirections(source, destination.destination);
            // const directions = "working";
            
            res.status(200).json({directions});
        } catch (error) {
            res.status(500).json({
                status: 'fail',
                message: "fail to get directions i m in controller"
            });
        } 
    } catch (error) {
        res.status(500).json({
            status: 'fail',
            message: "fail to get request id"
        });
    }
}