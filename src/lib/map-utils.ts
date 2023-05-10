export function convertToGeoJSON(location, geoJSON) {
    const { id, geometry, latitude, longitude, area, type, name } = location;
    const coordinates = [longitude, latitude];
  
    geoJSON.features.push({
      type:"Feature",
      geometry:{
        type: geometry,
        coordinates: coordinates
      },
      properties :{
        id: id,
        area: area,
        type: type,
        name: name
        // include any additional properties here
     }});
  
  }