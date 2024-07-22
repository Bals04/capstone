

var userLat = 0;
var userLong = 0;
var show = false;
var control = null; // Variable to hold the reference to the routing control
var dist = 0;
var ctr = null;
var map = L.map("map").setView([7.110959021754781, 125.61266071845108], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

var geocoder = L.Control.Geocoder.nominatim({
    geocodingQueryParams: {
        countrycodes: 'PH', // Restrict geocoding results to Philippines
        // city: 'Davao City', // Restrict results to Davao City
        limit: 1 // Limit number of results
    }
});

// ? ARRAYS THAT CAN BE USED AS LOCATIONS LIKE, NEARBY GYMS OR GYMS AROUND THE CITY
var gyms = [];
var parks = [];
var markers = [];
var parkmarkers = [];
var nearby = [];
let distances = [];

var userMarker = null;
var userLoc = null;

// ? REQUEST DATA FROM DATABASE TO USE IT HERE 
async function fetchGyms() {
    try {
        const response = await axios.get('http://localhost:3000/gyms');
        const Gyms = response.data;
        Gyms.forEach(G => {

            gyms.push({
                id: G.gym_id,
                name: G.gym_name,
                dailyRates: G.daily_rate,
                monthlyRates: G.monthly_rate,
                coords: [G.latitude, G.longtitude],
                img: G.img,
                avg: G.Average,
                contact: G.contact_no,
                address: G.street_address
            });

        });
        gyms.forEach(function (gym) {
            var marker = L.marker(gym.coords).addTo(map);
            marker.bindPopup(function () {
                // Create your popup content dynamically
                const popupContent = `
        <div>
            <img src="${gym.img}" alt="Gym Image" style="max-width: 100%; height: auto;">
            <h3>${gym.name}</h3>
            <p><strong>Daily rates:</strong> ${gym.dailyRates}</p>
            <p><strong>Monthly rates:</strong> ${gym.monthlyRates}</p>
            <p><strong>Ratings:</strong> ${gym.avg}</p>
            <div class="rating-stars" data-rating="${gym.avg}">
                <i class="rating-star fas fa-star text-gray-400"></i>
                <i class="rating-star fas fa-star text-gray-400"></i>
                <i class="rating-star fas fa-star text-gray-400"></i>
                <i class="rating-star fas fa-star text-gray-400"></i>
                <i class="rating-star fas fa-star text-gray-400"></i>
            </div>
        </div>
    `;

                // Return the content as a string
                return popupContent;

            });

            markers.push(marker);
            marker.on('popupopen', function () {

                setStarRatings()

            });


        });
        populateAllGymsList()
        populateAllParksList()

    } catch (error) {
        console.error('Error fetching gyms data:', error);
    }
}
const customMarkerIcon = L.divIcon({
    className: 'custom-marker-icon',
    html: `
        <div style="position: relative; width: 25px; height: 41px;">
            <!-- Marker background -->
            <svg width="25" height="41" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 41">
                <circle cx="12.5" cy="20" r="12" fill="red"/>
                <path d="M12.5 0C5.6 0 0 5.6 0 12.5 0 21.5 12.5 41 12.5 41S25 21.5 25 12.5C25 5.6 19.4 0 12.5 0z" fill="#fff"/>
            </svg>
            <!-- Location icon -->
            <i class="fas fa-map-marker-alt" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); color: red; font-size: 16px;"></i>
        </div>
    `,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
async function fetchParks() {
    try {
        const response = await axios.get('http://localhost:3000/parks');
        const Parks = response.data;
        Parks.forEach(G => {

            parks.push({
                id: G.id,
                name: G.name,
                coords: [G.latitude, G.longitude],
                img: G.img,
                address: G.address,
                openAt: G.opens_at,
                closeAt: G.closes_at
            });

        });

        parks.forEach(function (p) {
            var Parkmarker = L.marker(p.coords, { icon: customMarkerIcon }).addTo(map);
            Parkmarker.bindPopup(function () {
                // Create your popup content dynamically
                const popupContent = `
    <div style="max-width: 300px; padding: 10px; font-family: Arial, sans-serif; color: #333;">
        <img src="${p.img}" alt="Gym Image" style="width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        <h1 style="font-size: 18px; margin: 10px 0; color: #1a1a1a; font-weight: bold;">${p.name}</h1>
        <div style="display: flex; align-items: center; font-size: 14px; color: #555;">
            <i class="fas fa-map-marker-alt" style="margin-right: 8px; color: #007bff;"></i>
            <span>${p.address}</span>
        </div>
    </div>
`;
                // Return the content as a string
                return popupContent;

            });

            parkmarkers.push(Parkmarker);
            Parkmarker.on('popupopen', function () {
                setStarRatings()
            });
        });
        //populateAllGymsList()
    } catch (error) {
        console.error('Error fetching gyms data:', error);
    }
}

//EXECUTE THE FUNCTION
fetchGyms();
fetchParks();



function populateGymsList(userCoords) { //? THIS FUNCTION POPULATES THE 3 NEAREST GYMS AND SHOW IT TO THE USER
    var gymsList = document.getElementById("nearestGymsList");
    var userlat = userCoords[0];
    var userlong = userCoords[1];
    // Clear existing list items
    gymsList.innerHTML = "";

    
    distances.slice(0, 3).forEach(function (nearbyGym, index) { 
    var listItem = document.createElement("div"); 
        
        listItem.classList.add( 
            "gym-item", 
            "cursor-pointer",
            "p-4",
            "mb-2.5",
            "border",
            "border-customGray",
            "rounded-lg",
            "bg-customGray",
            "transition",
            "duration-300",
            "ease-in-out",
            "flex",
            "flex-col",
            "items-start",
            "hover:bg-red-700",
            "text-white" 
        );
        var content = ` 
  <div class="al-gym-name text-lg font-bold mb-2.5">${nearbyGym.name} - <span>${nearbyGym.distance} km</span></div>
  
  <div class="all-gym-details flex gap-2.5">
    <img src="${nearbyGym.img}" alt="Gym Image" class="w-24 h-24 object-cover rounded-lg">
    <div class="rates flex flex-col">
      <div class="Daily-rate text-sm mt-1.5"><strong>Daily rate:</strong> ${nearbyGym.dailyRates}</div>
      <div class="Monthly-rate text-sm mt-1.5"><strong>Monthly rate:</strong> ${nearbyGym.monthlyRates}</div>
      <div class="text-sm mt-1.5">
        <i class="fas fa-phone-alt"></i>&nbsp ${nearbyGym.contact}
      </div>
      <div class="text-sm mt-1.5">
        <i class="fas fa-map-marker-alt"></i>&nbsp ${nearbyGym.address}
      </div>
      <div class="rating flex items-center text-sm mt-1.5">
        <strong>Ratings:</strong>&nbsp${nearbyGym.average}
        <div class="rating-stars flex ml-2" data-rating="${nearbyGym.average}">
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
        </div>
      </div>
            <div class="text-sm mt-1.5">
                <button class="bg-customOrange p-2 rounded-md text-white flex items-center">
          <i class="fas fa-directions mr-1"></i> &nbsp Directions
        </button>
      </div>
    </div>
  </div>`; //? THIS IS THE CONTENT OF THE DIV THAT WE JUST CREATED EARLIER IT HAS, IMAGE AND OTHER INFOS

        listItem.innerHTML = content;
        listItem.addEventListener("click", function (e) {
            removeLastMarker()
            var gymDistanceLat = 0;
            var gymDistanceLong = 0;
            console.log(`Clicked on ${nearbyGym.name}`);
            console.log(
                `coords:  ${nearbyGym.coords[0]}, ${nearbyGym.coords[1]}`
            );
            gymDistanceLat = nearbyGym.coords[0];
            gymDistanceLong = nearbyGym.coords[1];


            // Create a new marker for user location
            userLoc = L.marker([userlat, userlong]).addTo(map);
            // Create a new marker for gym location
            var gymMarker = L.marker([gymDistanceLat, gymDistanceLong]).addTo(map);
            gymMarker.bindPopup(`
        <div>
          <img src="${nearbyGym.img}" alt="Gym Image" style="max-width: 100%; height: auto;">
          <h3>${nearbyGym.name}</h3>
          <p><strong>Daily rates:</strong> ${nearbyGym.dailyRates}</p>
          <p><strong>Monthly rates:</strong> ${nearbyGym.monthlyRates}</p>
        </div>
      `).openPopup();
            // Define the waypoints (user location and gym location) || CREATE A ROUTE BASED ON THE CLICKED GYM
            var waypoints = [
                L.latLng(userlat, userlong),
                L.latLng(gymDistanceLat, gymDistanceLong),
            ];

            // Clear previous route if exists
            if (control) {
                map.removeControl(control);
            }
            // Create routing control
            control = L.Routing.control({
                waypoints: waypoints,
                routeWhileDragging: true,
                show: !true,
                lineOptions: {
                    styles: [{ color: "red", opacity: 1, weight: 5 }],
                },
                createMarker: function () {
                    return null; // Do not create default markers
                },
            }).addTo(map);

            // Fit the map to show the route
            var bounds = L.latLngBounds([userlat, userlong], [gymDistanceLat, gymDistanceLong]);
            map.fitBounds(bounds);
        });
        gymsList.appendChild(listItem);
    });
}

//THIS FUNCTION RESETS THE MARKER WHENEVER THE USER CLICKS AGAIN ON THE MAP
function removeLastMarker() {
    if (userLoc) {
        console.log("inside the function")
        map.removeLayer(userLoc)
    } else {
        console.log("not inside")
    }
    if (userMarker) {
        map.removeLayer(userMarker)
    }
}

document.getElementById("showLoc").addEventListener("click", function () {
    var label = document.getElementById("showLoc");
    show = !show;
    label.innerText = show ? "SHOWING DIRECTIONS" : "HIDING WAYS";
    control.options.show = show;
});

//a function that lets the user click on the map and add a marker
function onMapClick(e) {
    removeLastMarker();
    userLoc = L.marker(e.latlng).addTo(map);
    if (ctr) {
        map.removeControl(ctr)
        ctr = null
        console.log("hi")
    } else {
        console.log("null ang ctr na")
    }
    // Example popup content
    userLoc.bindPopup("COORDS: " + e.latlng);
    userLat = e.latlng.lat;
    userLong = e.latlng.lng;
    var userCoords = [userLat, userLong];
    //var nearest = logDistancesToGyms(userCoords, gyms);
    //makeRoute(userLat, userLong);
    logDistancesToGyms(userCoords, gyms);
    setStarRatings();
}
// Listen for click events on the map
map.on("click", onMapClick);

async function logDistancesToGyms(userCoords, gyms) {
    // Helper function to handle completion
    function handleCompletion() {
        // Sort distances to find the nearest one
        distances.sort(function (a, b) {
            return a.distance - b.distance; // Sort numerically

        });

        if (distances.length > 0) {
            // Get the nearest gym
            let nearestGym = distances[0];
            //console.log("gym distances"+distances)
            // Remove the previous routing control if it exists
            if (control) {
                map.removeControl(control);
            }
            // Create a route to the nearest gym
            control = L.Routing.control({
                waypoints: [
                    L.latLng(userCoords[0], userCoords[1]),
                    L.latLng(nearestGym.gymCoords[0], nearestGym.gymCoords[1]),
                ],
                show: false,
                lineOptions: {
                    styles: [{ color: "red", opacity: 1, weight: 6 }],
                },
                routeWhileDragging: false,
                createMarker: function () {
                    return null;
                }, // Hide default markers
            }).addTo(map);
            populateGymsList(userCoords);
        } else {
            console.log("No gyms available to route to.");
        }
    }
    distances = []; //? Reset distances array for new calculation
    //? Process each gym
    for (let i = 0; i < gyms.length; i++) {
        const gym = gyms[i];
        var gymCoords = gym.coords;

        // Create the routing control
        let ctr = L.Routing.control({
            waypoints: [
                L.latLng(userCoords[0], userCoords[1]),
                L.latLng(gymCoords[0], gymCoords[1]),
            ],
            routeWhileDragging: false,
            createMarker: function () {
                return null; // Hide default markers
            },
            lineOptions: {
                styles: [
                    {
                        color: 'blue', // Fully transparent line
                        opacity: 10, // Line opacity
                        weight: 3, // Line width
                    },
                ],
            },
            show: false, // Hide the route summary panel
        }).addTo(map);

        removeControlContainer(ctr);

        // Wait for the 'routesfound' event to get route details
        let routeDetails = await new Promise((resolve) => {
            ctr.on('routesfound', function (e) {
                var route = e.routes[0]; // Get the first route
                var distanceInKm = route.summary.totalDistance / 1000; // Convert meters to kilometers
                resolve({
                    img: gym.img,
                    name: gym.name,
                    dailyRates: gym.dailyRates,
                    monthlyRates: gym.monthlyRates,
                    average: gym.avg,
                    address: gym.address,
                    contact: gym.contact,
                    gymCoords: gym.coords, // Store coordinates for route creation
                    distance: distanceInKm.toFixed(2),
                    coords: gym.coords,
                });
            });
        });

        distances.push(routeDetails);

        // Remove the routing control from the map
        map.removeControl(ctr);
    }

    // After processing all gyms, handle completion
    handleCompletion();
}

function removeControlContainer(control) {
    const container = control.getContainer();
    if (container) {
        container.parentNode.removeChild(container);
    }
}


function setStarRatings() {
    const ratingContainers = document.querySelectorAll('.rating-stars');
    ratingContainers.forEach(container => {
        const rating = parseFloat(container.getAttribute('data-rating'));
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5 ? 1 : 0;

        const stars = container.querySelectorAll('.rating-star');

        stars.forEach((star, index) => {
            if (index < fullStars) {
                star.classList.remove('text-gray-400'); // Remove gray color
                star.classList.add('text-yellow-500');
            } else if (index === fullStars && halfStar) {
                star.classList.remove('text-gray-400'); // Remove gray color
                star.classList.add('text-yellow-500');
                star.classList.remove('fa-star');
                star.classList.add('fa-star-half-alt');
            }
        });
    });
}

function populateAllGymsList() {
    var gymsList = document.getElementById("all-gyms");
    var userMarker = null;
    // Clear existing list items
    gymsList.innerHTML = "";
    // Add new list items
    gyms.forEach(function (g) {
        var listItem = document.createElement("div");
        listItem.classList.add(
            "gym-item",
            "cursor-pointer",
            "p-4", "mb-2",
            "border",
            "border-gray-300",
            "rounded-lg",
            "bg-gray-100",
            "hover:bg-gray-200",
            "flex", "flex-col",
            "items-start",
            "transition-colors",
            "duration-300");

        var content = `
  <div class="al-gym-name text-lg font-bold mb-2.5">${g.name}</div>
  <div class="all-gym-details flex gap-2.5">
    <img src="${g.img}" alt="Gym Image" class="w-24 h-24 object-cover rounded-lg">
    <div class="flex flex-col flex-1">
      <div class="Daily-rate text-sm mt-1.5"><strong>Daily rate:</strong> ${g.dailyRates}</div>
      <div class="Monthly-rate text-sm mt-1.5"><strong>Monthly rate:</strong> ${g.monthlyRates}</div>
      <div class="text-sm mt-1.5">
        <i class="fas fa-phone-alt"></i>&nbsp ${g.contact}
      </div>
      <div class="text-sm mt-1.5">
        <i class="fas fa-map-marker-alt"></i>&nbsp ${g.address}
      </div>
      <div class="rating flex items-center text-sm mt-1.5">
        <strong>Ratings:</strong>&nbsp${g.avg}
        <div class="rating-stars flex ml-2" data-rating="${g.avg}">
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
          <i class="rating-star fas fa-star text-gray-400"></i>
        </div>
      </div>
      <div class="text-sm mt-1.5">
        <button class="bg-gray-900 p-2 rounded-md text-white">See more</button>
      </div>
    </div>
  </div>`;
        listItem.innerHTML = content;
        document.getElementById("all-gyms").appendChild(listItem);
    });
}

function populateAllParksList() {
    var parkList = document.getElementById("all-park");
    var userMarker = null;
    // Clear existing list items
    parkList.innerHTML = "";
    // Add new list items
    parks.forEach(function (g) {
        var listItem = document.createElement("div");
        listItem.classList.add(
            "gym-item",
            "cursor-pointer",
            "p-4", "mb-2",
            "border",
            "border-gray-300",
            "rounded-lg",
            "bg-gray-100",
            "hover:bg-gray-200",
            "flex", "flex-col",
            "items-start",
            "transition-colors",
            "duration-300");

        var content = `
  <div class="al-gym-name text-lg font-bold mb-2.5">${g.name}</div>
  <div class="all-gym-details flex gap-2.5">
    <img src="${g.img}" alt="Gym Image" class="w-24 h-24 object-cover rounded-lg">
    <div class="flex flex-col flex-1">
      <div class="text-sm mt-1.5">
        <i class="fas fa-map-marker-alt"></i>&nbsp ${g.address}
      </div>
      <div class="text-sm mt-1.5 flex items-center">
        <i class="fas fa-clock"></i>&nbsp Open: ${g.openAt} - Closes: ${g.closeAt}
      </div>
    </div>
  </div>`;

        listItem.innerHTML = content;
        document.getElementById("all-park").appendChild(listItem);
    });
}

function showSection(sectionId, id) {
    document.querySelectorAll('.toggle-btn').forEach(section => section.classList.remove('bg-orange-700'));
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(id).classList.add('bg-orange-700');
}


document.getElementById('locateBtn').addEventListener('click', function (event) {
    removeLastMarker();
    var userloc = document.getElementById('address').value;
    var address = userloc.concat(', Davao city')
    var coordinates = [];
    geocoder.geocode(address, function (results) {
        console.log(results); // Log geocoding results to inspect in the console
        if (results.length > 0) {
            var latLng = results[0].center;
            coordinates.push(latLng.lat); // Store latitude in the array
            coordinates.push(latLng.lng); // Store longitude in the array
            console.log(coordinates)
            map.setView(latLng, 13); // Set map view to the geocoded location
            userMarker = L.marker(latLng).addTo(map)
                .bindPopup("Your current address: " + address.name)
                .openPopup();
            logDistancesToGyms(coordinates, gyms);
            setStarRatings();
        } else {
            alert('Location not found');
        }

    })
})

