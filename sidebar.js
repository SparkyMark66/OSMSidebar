// Get references to the elements
const postcodeInput = document.getElementById('postcodeInput');
const findButton = document.getElementById('findButton');
const clearButton = document.getElementById('clearButton');
const latitudeDisplay = document.getElementById('latitudeDisplay'); // New
const longitudeDisplay = document.getElementById('longitudeDisplay'); // New

console.log("Sidebar script loaded.");

// --- Initialize Leaflet Map ---
const mapDiv = document.getElementById('mapid');
let mymap = null;
let markers = null;

function initializeMap() {
    if (mymap !== null) {
        console.log("Map already initialized.");
        return;
    }
    console.log("Initializing Leaflet map.");
    mymap = L.map('mapid').setView([55.0, -2.0], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(mymap);
    markers = L.layerGroup().addTo(mymap);
}
initializeMap();

// --- Message Listener for Background Script ---
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "mapPostcode" && request.postcode) {
    const receivedPostcode = request.postcode;
    console.log(`Received postcode from background script: "${receivedPostcode}"`);
    postcodeInput.value = receivedPostcode;
    findButton.click();
    sendResponse({ status: "success", message: "Postcode processed in sidebar." });
    return true;
  }
});

// --- Helper function to send message to sidebar with retries ---
const sendMessageToSidebarWithRetry = (postcode, maxRetries = 5, delayMs = 200) => {
  let retries = 0;

  const attemptSendMessage = () => {
    chrome.runtime.sendMessage({
      action: "mapPostcode",
      postcode: postcode
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.warn(`Attempt ${retries + 1}/${maxRetries} failed to send message: ${chrome.runtime.lastError.message}. Retrying...`);
        retries++;
        if (retries < maxRetries) {
          setTimeout(attemptSendMessage, delayMs);
        } else {
          console.error("Failed to send message to sidebar after maximum retries.");
        }
      } else {
        console.log("Message sent to sidebar, response:", response);
      }
    });
  };
  attemptSendMessage();
};

// --- Find Button Logic ---
findButton.addEventListener('click', async () => {
  const postcode = postcodeInput.value.trim();
  console.log(`Find button clicked. Postcode entered: "${postcode}"`);

  if (!postcode) {
    alert('Please enter a postcode.');
    return;
  }

  const nominatimUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(postcode)}, UK&format=json&addressdetails=1&limit=1`;
  console.log(`Nominatim URL: ${nominatimUrl}`);

  try {
    const response = await fetch(nominatimUrl);
    console.log('Fetch response received', response);

    if (!response.ok) {
         console.error(`HTTP error! Status: ${response.status}`);
         const errorText = await response.text();
         console.error('Response body:', errorText);
         throw new Error(`Network response was not ok, status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received from Nominatim:', data);

    if (data && data.length > 0) {
      const location = data[0];
      const lat = parseFloat(location.lat);
      const lon = parseFloat(location.lon);

       if (isNaN(lat) || isNaN(lon)) {
          console.error("Invalid lat/lon received from Nominatim", location);
          alert("Could not get valid coordinates for the postcode.");
          return;
      }

      // --- Update the latitude and longitude display elements ---
      latitudeDisplay.textContent = `Latitude: ${lat.toFixed(6)}`; // Format to 6 decimal places
      longitudeDisplay.textContent = `Longitude: ${lon.toFixed(6)}`;

      console.log(`Location found: Lat=${lat}, Lon=${lon}`);

      if(mymap) {
          const zoomLevel = 16;
          mymap.setView([lat, lon], zoomLevel);

          if (markers) {
             markers.clearLayers();
             L.marker([lat, lon])
                .addTo(markers)
                .bindPopup(`<b>${postcode}</b><br>${location.display_name || 'Location'}`)
                .openPopup();
             console.log(`Marker added at [${lat}, ${lon}]`);
          } else {
             console.error("Marker layer group not initialized!");
          }
          console.log(`Map view set to [${lat}, ${lon}] with zoom ${zoomLevel}`);
      } else {
          console.error("Map not initialized when trying to set view!");
      }
    } else {
      console.warn(`No results found for postcode: ${postcode}`);
      alert(`Could not find location for postcode: ${postcode}. Please ensure it's a valid UK postcode.`);
      if (markers) { markers.clearLayers(); }
      // Clear the lat/lon display if no results
      latitudeDisplay.textContent = "";
      longitudeDisplay.textContent = "";
    }
  } catch (error) {
    console.error('Error during postcode lookup or map update:', error);
    alert('An error occurred. Check the sidebar console for details.');
    if (markers) { markers.clearLayers(); }
     // Clear the lat/lon display on error
      latitudeDisplay.textContent = "";
      longitudeDisplay.textContent = "";
  }
});

// --- Clear Button Logic ---
clearButton.addEventListener('click', () => {
  console.log('Clear button clicked.');
  postcodeInput.value = '';
  if(mymap) {
    mymap.setView([55.0, -2.0], 6);
    if (markers) { markers.clearLayers(); }
  }
  // Clear the lat/lon display when clearing
  latitudeDisplay.textContent = "";
  longitudeDisplay.textContent = "";
  console.log('Map view reset, markers cleared, and input cleared.');
});

// --- Enter Key Press Logic ---
postcodeInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        console.log('Enter key pressed in input.');
        findButton.click();
    }
});