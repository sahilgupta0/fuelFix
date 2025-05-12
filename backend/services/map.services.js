
// import axios from 'axios';
const axios = require('axios');


module.exports.getAddressCoordinates = async (address) => {
  try {
    const apiKey = process.env.GOOGLE_MAP_API ;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;
    
    const response = await axios.get(url);
    
    if (response.data.status === 'OK') {
      const location = response.data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng
      };
    } else {
      throw new Error('Unable to find address');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    throw error;
  }
}

module.exports.getDistanceTime = async (origin, destination) => {
  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }
  console.log('Origin:', origin); 
  console.log('Destination:', destination);
  const apiKey = process.env.GOOGLE_MAP_API ;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    console.log('Response:', response.data);
    
    if (response.data.status === 'OK') {
      if( response.data.rows[0].elements[0].status !== 'OK') {
        throw new Error('Unable to calculate distance and time');
      }
      return response.data.rows[0].elements[0];
      
    } else {
      throw new Error('Unable to calculate distance and time');
    }
  } catch (error) {
    console.error('Error fetching distance and time:', error);
    throw error;
  }
}

module.exports.getSuggestions = async (input) => {
  if (!input) {
    throw new Error('Input is required');
  }
  try {
    const apiKey = process.env.GOOGLE_MAP_API ;
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;
    const response = await axios.get(url);
    if (response.data.status === 'OK') {
      return response.data.predictions;
    } else {
      throw new Error('Unable to fetch suggestions');
    }
  }
  catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
}