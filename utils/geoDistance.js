/**
 * Calculates the distance between two geographic coordinates (latitude, longitude)
 * using the Haversine formula.
 *
 * @param {Array} coord1 - Array of two numbers representing [longitude, latitude] of the first location.
 * @param {Array} coord2 - Array of two numbers representing [longitude, latitude] of the second location.
 * @param {Object} options - Optional parameters for the calculation.
 *    - {String} unit - Unit of distance: 'km' (default) for kilometers, 'miles', or 'nauticalMiles'.
 *    - {Number} earthRadius - Custom Earth radius in kilometers (default: 6371 km).
 * @returns {Number} - The distance between the two coordinates in the specified unit.
 */
const calculateGeoDistance = (coord1, coord2, options = {}) => {
    // Extract options or set defaults
    const unit = options.unit || 'km'; // Default is kilometers
    const earthRadius = options.earthRadius || 6371; // Default Earth's radius in kilometers
    
    // Validate the input coordinates
    if (!isValidCoordinates(coord1) || !isValidCoordinates(coord2)) {
      throw new Error('Invalid coordinates. Coordinates must be in the format [longitude, latitude].');
    }
    
    // Convert degrees to radians
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    
    // Destructure latitude and longitude from both coordinates
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    // Haversine formula to calculate the distance
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    // Calculate the distance in kilometers
    let distance = earthRadius * c;
    
    // Convert to the specified unit
    switch (unit) {
      case 'miles':
        distance *= 0.621371; // Convert to miles
        break;
      case 'nauticalMiles':
        distance *= 0.539957; // Convert to nautical miles
        break;
      case 'km':
      default:
        // Keep as kilometers, no conversion needed
        break;
    }
    
    // Optionally round to a set number of decimal places for better readability
    return Math.round(distance * 100) / 100; // Rounds to two decimal places
  };
  
  /**
   * Validates whether the given coordinates are valid.
   * Coordinates should be in the format [longitude, latitude].
   *
   * @param {Array} coords - The coordinates to validate.
   * @returns {Boolean} - Returns true if valid, false otherwise.
   */
  const isValidCoordinates = (coords) => {
    return (
      Array.isArray(coords) &&
      coords.length === 2 &&
      typeof coords[0] === 'number' &&
      typeof coords[1] === 'number' &&
      coords[1] >= -90 && coords[1] <= 90 && // Latitude must be between -90 and 90
      coords[0] >= -180 && coords[0] <= 180  // Longitude must be between -180 and 180
    );
  };
  
  module.exports = calculateGeoDistance;
  