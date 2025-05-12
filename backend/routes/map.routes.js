const express = require('express');
// import express from 'express';
const router = express.Router();
const mapController  = require('../controller/map.controller');
// import getCoordinates from '../controller/map.controller.js';

router.get('/coordinates',mapController.getCoordinates);
router.get('/get-distace-time',mapController.getDistaceTime);
router.get('/get-suggestions',mapController.getSuggestions);
router.get('/get-directions',mapController.getDirections);

module.exports = router;
