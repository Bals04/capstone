

var userLat = 0;
var userLong = 0;
var show = false;
var control = null; // Variable to hold the reference to the routing control
var dist = 0;
var ctr = null;
var map = L.map("map").setView([7.110959021754781, 125.61266071845108], 13);

osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

dark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 19
}).addTo(map);

googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map)

googleHybrid = L.tileLayer('http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map)

googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map)

var baseLayers = {
    "Dark": dark,
    "Detailed Satelite": googleHybrid,
    "Satelite": googleSat,
    "Detailed": googleStreets,
    "Default": osm
};
L.control.layers(baseLayers).addTo(map);

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

const customMarkerIcon = L.icon({
    iconUrl: '/frontend/views/img/location.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
});

const customUserIcon = L.icon({
    iconUrl: '/frontend/views/img/location-pin.svg',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
});
const gymIcon = L.icon({
    iconUrl: '/frontend/views/img/dumbell.svg',
    iconSize: [40, 100],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],

});

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
                img: G.img_path,
                avg: G.Average,
                contact: G.contact_no,
                address: G.street_address,
            });

        });
        gyms.forEach(function (gym) {
            var marker = L.marker(gym.coords, { icon: gymIcon }).addTo(map);
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
        setTimeout(() => {
            setStarRatings()
        }, 0);

    } catch (error) {
        console.error('Error fetching gyms data:', error);
    }
}

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

    //* diri na part tong css sa - 3 NEARBY GYMS
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
            "bg-customGrayBtn",
            "transition",
            "duration-300",
            "ease-in-out",
            "flex",
            "flex-row",
            "items-center",
            "hover:bg-customGray1",
            "text-white"
        );

        var content = ` 
        <img src="${nearbyGym.img}" alt="Gym Image" class="w-24 h-24 object-cover rounded-lg mr-4">
        <div class="flex flex-col">
            <div class="al-gym-name text-lg font-bold">${nearbyGym.name}</div>
            <div class="flex items-center text-sm">
                <i class="fas fa-location-arrow mr-1"></i>${nearbyGym.distance} Km away
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
        </div>`; //? THIS IS THE CONTENT OF THE DIV THAT WE JUST CREATED EARLIER IT HAS, IMAGE AND OTHER INFOS

        listItem.innerHTML = content;
        setTimeout(() => {
            setStarRatings()
        }, 0);
        listItem.addEventListener("click", function (e) {
            removeLastMarker()
            var gymDistanceLat = 0;
            var gymDistanceLong = 0;

            showNearby(distances[index])
            gymDistanceLat = nearbyGym.coords[0];
            gymDistanceLong = nearbyGym.coords[1];

            // Create a new marker for user location
            userLoc = L.marker([userlat, userlong], { icon: customUserIcon }).addTo(map);
            // Create a new marker for gym location
            var gymMarker = L.marker([gymDistanceLat, gymDistanceLong]);
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
        map.removeLayer(userLoc)
    } else {
    }
    if (userMarker) {
        map.removeLayer(userMarker)
    }
}

document.getElementById("showLoc").addEventListener("click", function () {
    var label = document.getElementById("showLoc");
    show = !show;
    label.innerText = show ? "Displaying directions" : "Hiding Directions";
    control.options.show = show;
});

//a function that lets the user click on the map and add a new fakeng marker
function onMapClick(e) {
    removeLastMarker();
    userLoc = L.marker(e.latlng, { icon: customUserIcon }).addTo(map);
    if (ctr) {
        map.removeControl(ctr)
        ctr = null
    }
    // Example sa popup content
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

function showNearby(distances) {
    let gym = distances;
    const overlay2 = document.getElementById("overlay2");
    const container = document.getElementById("overlay2");
    container.innerHTML = "";
    overlay2.classList.remove("hidden");

    // Create the main div with the required classes
    const listItem = document.createElement('div');
    listItem.classList.add(
        "gym-item",
        "cursor-pointer",
        "p-2",
        "mb-2",
        "border",
        "border-gray-800",
        "rounded-lg",
        "bg-customGrayBtn",
        "transition",
        "duration-300",
        "ease-in-out",
        "flex",
        "flex-col",
        "items-start",
        "shadow-md",
        "font-[Poppins]",
    );

    // Create the content
    const content = `
        <div class="text-white text-2xl">
            <button><ion-icon name="close-outline"></ion-icon></button>
        </div>
        <div class="w-full h-40 bg-customGrayBtn rounded-t-lg"
            style="background-image: url('${gym.img}');
            background-size: cover; background-position: center;">
        </div>
        <div class="p2 mt-2">
            <h3 class="text-lg font-semibold"> ${gym.name}</h3>
        </div>
        <div class="flex items-center text-sm mb-1">
            <div class="rating flex items-center text-sm mt-1.5">
                <strong>Ratings:</strong>&nbsp<span id="rating-value">${gym.average}</span>
                <div class="rating-stars flex ml-2" data-rating="${gym.average}">
                    <i class="rating-star fas fa-star text-gray-400"></i>
                    <i class="rating-star fas fa-star text-gray-400"></i>
                    <i class="rating-star fas fa-star text-gray-400"></i>
                    <i class="rating-star fas fa-star text-gray-400"></i>
                    <i class="rating-star fas fa-star text-gray-400"></i>
                </div>
            </div>
        </div>
        <div class="p2 flex flex-col mb-1">
            <div class="flex flex-col mb-1 mt-1">
                <span id="nearby_distance" class="text-sm flex items-center" style="font-weight: 300;">
                    <i class="fas fa-location-arrow mr-1 mt-1"></i>
                    ${gym.distance} km away
                </span>
                <div class="flex flex-col mb-1 mt-1">
                    <span class="text-sm"><i class="fas fa-money-bill-alt mr-1 mt-1"></i>&nbsp;₱${gym.dailyRates}/Session</span>
                    <span class="text-sm"><i class="fas fa-money-bill-alt mr-1 mt-1"></i>&nbsp;₱${gym.monthlyRates}/Monthly</span>
                </div>
            </div>
        </div>
        <div class="flex flex-row gap-2 text-center justify-center mx-auto my-auto text-white text-sm">
            <div>
                <button class="rounded-full bg-customGrayBtn hover:bg-customGray py-2 px-3 shadow-lg">
                    <i class="fas fa-arrows-alt"></i>
                </button>
            </div>
            <div>
                <button class="rounded-full bg-customGrayBtn hover:bg-customGray py-2 px-3 shadow-lg">
                    <i class='fas fa-phone-alt'></i>
                </button>
            </div>
            <div>
                <button class="rounded-full bg-customGrayBtn hover:bg-customGray py-2 px-3 shadow-lg">
                    <i class='fas fa-bookmark'></i>
                </button>
            </div>
        </div>
        <div class="text-sm mb-1 mt-6 ">  
            <i class="fas fa-map-marker-alt"></i>&nbsp; ${gym.address}
        </div>
        <div class="text-sm mb-1">
            <i class="fas fa-phone-alt"></i>&nbsp; ${gym.contact}
        </div>
        <div class="flex items-center justify-between my-auto mx-auto p-2">
            <button id="openStreetView" data-src="${gym.street_view}" class="bg-customGrayBtn text-white px-3 py-1 rounded-md text-sm ml-2 flex items-center hover:bg-customGray shadow-lg">
                <i class="fas fa-eye mr-2"></i> Street view
            </button>
        </div>
    `;

    // Set the content to the listItem
    listItem.innerHTML = content;

    // Append the listItem to the container
    container.appendChild(listItem);

    //* Added an event listener for the click event to open streetview.
    //* I used setTimeout() here to make the button element to load first before assigning a click event 
    setTimeout(() => {
        const button = document.getElementById("openStreetView")
        if (button) {
            button.addEventListener('click', function () {
                event.stopPropagation();
                const src = this.getAttribute('data-src');
                ToggleStreetView(src);
            });
        } else {
            console.error(`Button not found.`);
        }
    }, 0);

}

//* function to make a route to all the gyms in the city from the location of the user
//* and finding the nearest gym.
async function logDistancesToGyms(userCoords, gyms) {
    // Helper function to handle completion
    function handleCompletion() {
        // Sort distances to find the nearest one
        distances.sort(function (a, b) {
            return a.distance - b.distance; // Sort numerically

        });

        if (distances.length > 0) {
            // Get the nearest gym
            showNearby(distances[0]);
            let nearestGym = distances[0];
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
                show: !true,
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
                return null;
            },
            lineOptions: {
                styles: [
                    {
                        color: 'blue',
                        opacity: 10,
                        weight: 3,
                    },
                ],
            },
            show: false, // Hide the route summary panel
        }).addTo(map);


        // Wait for the 'routesfound' event to get route details
        let routeDetails = await new Promise((resolve) => {
            ctr.on('routesfound', function (e) {
                var route = e.routes[0]; // Get the first route
                var distanceInKm = route.summary.totalDistance / 1000; //! Convert meters to kilometers - diri ko magkuha sa distance in km
                resolve({
                    id: gym.id,
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
                    street_view: gym.street_view
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

//* function to make the stars dynamic based on the given ratings
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

//* function to populaate all gyms in the "Gyms around the city" section
function populateAllGymsList() {
    var gymsList = document.getElementById("all-gyms");
    var userMarker = null;
    // Clear existing list items
    gymsList.innerHTML = "";
    // Add new list items - ITEMS PARA SA GYMS AROUND THE CITY
    gyms.forEach(function (g, index) {
        var listItem = document.createElement("div");
        listItem.classList.add(
            "gym-item",
            "cursor-pointer",
            "p-4",
            "mb-2.5",
            "border",
            "border-customGray",
            "rounded-lg",
            "bg-customGrayBtn",
            "transition",
            "duration-300",
            "ease-in-out",
            "flex",
            "flex-row",
            "items-center",
            "hover:bg-customGray1",
            "text-white"
        );
        var content = ` 
            <img src="${g.img}" alt="Gym Image" class="w-24 h-24 object-cover rounded-lg mr-4">
            <div class="flex flex-col">
                <div class="al-gym-name text-lg font-bold">${g.name}</div>
                <div class="text-sm mb-1">  
                    <i class="fas fa-map-marker-alt"></i>&nbsp; ${g.address}
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
            </div>`;
        listItem.innerHTML = content;
        document.getElementById("all-gyms").appendChild(listItem);

        listItem.addEventListener("click", function (e) {
            showNearby(gyms[index])
            const distanceElement = document.getElementById('nearby_distance');//mao ning id sa <span> na diri nakabutang ang "2.87 km away"
            distanceElement.classList.add('hidden'); //ihide sya gamit classlist kay and styles nato kay nasa class kay tailwind man

        })
    });
}

//*diri na part tong STREETVIEW 
function ToggleStreetView(src) {
    const close = document.getElementById('closeView');
    const overlay2 = document.getElementById("overlay2");
    // Get the overlay element
    const overlay = document.getElementById('overlay');
    // Remove the 'hidden' class to show the overlay
    overlay.classList.remove('hidden');
    overlay2.classList.add('hidden')
    // Select the target div where the iframe should be added
    const gymCardDiv = document.querySelector('.street-card');
    // Remove any existing iframe in the div
    const existingIframe = gymCardDiv.querySelector('iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    // Create a new iframe element
    const newIframe = document.createElement('iframe');
    newIframe.className = 'w-full h-40 sm:h-[16rem] lg:h-[16rem] lg:w-full'; // Set class names for styling
    newIframe.src = `${src}`;
    // Set the src dynamically
    // Append the new iframe to the target div
    gymCardDiv.appendChild(newIframe);
    close.addEventListener('click', function () {
        event.stopPropagation(); // Prevents the click event from bubbling up
        overlay.classList.add('hidden');
    })
}

//* DIRI TONG PAGBUHAT UG HTML ELEMENT UG PAG ADD UG CSS SA PARKS
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
            "border-customGray",
            "rounded-lg",
            "bg-customGrayBtn",
            "hover:bg-customGray1",
            "flex", "flex-col",
            "items-start",
            "transition-colors",
            "duration-300",
            "text-white");

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
    document.querySelectorAll('.toggle-btn').forEach(section => section.classList.remove('bg-customGray'));
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => section.classList.add('hidden'));
    // Show the selected section
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(id).classList.add('bg-customGray');
}

//*GEOCODING FEATURE (Address to Coordinates)
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
            userMarker = L.marker(latLng, { icon: customUserIcon }).addTo(map)
            logDistancesToGyms(coordinates, gyms);
            setStarRatings();
        } else {
            alert('Location not found');
        }

    })
})

//* LIVE LOCATION FEATURE
document.getElementById('trackLocation').addEventListener('click', function (event) {
    var x = "";
    var coordinates = [];
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
    };
    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,error,options);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
    function showPosition(position) {
        removeLastMarker();
        coordinates.push(position.coords.latitude); //* Store latitude in the array
        coordinates.push(position.coords.longitude); //* Store longitude in the array
        map.setView(coordinates, 13); //* Set the map view to the live location of the user
        userMarker = L.marker(coordinates, { icon: customUserIcon }).addTo(map) //*I USED THE ARRAY TO PINPOINT THE EXACT LOCATION OF THE USER 
        alert(`Latitude: ${position.coords.latitude} Longtitude: ${position.coords.longitude}`)
    }
})

//TYPEWRITER
var typed = new Typed(".auto-type",{
    strings : ["Nearby gyms", "Gyms around the city", "Recreational areas"],
    typeSpeed : 150,
    backSpeed : 70,
    looped: true,
    loop: true
})