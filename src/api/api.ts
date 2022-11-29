

export const getAllPlaces = (): Promise<any> => {

    return fetch(`http://localhost:8080/api/place/`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error with api call");
        }
    })
    .catch(function(error) {
        console.log("Error fetching API: " + error);
    });
}

export const getPlaceById = (id: string): Promise<any> => {

    return fetch(`http://localhost:8080/api/place/${encodeURIComponent(id)}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error with api call");
        }
    })
    .catch(function(error) {
        console.log("Error fetching API: " + error);
    });
}

export const getImagesByPlaceId = (placeId: string): Promise<any> => {

    return fetch(`http://localhost:8080/api/image/${encodeURIComponent(placeId)}`)
    .then(function(response) {
        if (response.ok) {
            return response.json();
        } else {
            console.log("Error with api call");
        }
    })
    .catch(function(error) {
        console.log("Error fetching API: " + error);
    });
}