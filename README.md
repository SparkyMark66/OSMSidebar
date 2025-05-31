# Postcode Map Viewer - Edge Extension

A Microsoft Edge browser extension that provides a convenient sidebar to search for UK postcodes, display their location on an interactive OpenStreetMap, and offers various utilities for map interaction.

## ✨ Features

* **Sidebar Interface:** A dedicated side panel in Edge to interact with the map viewer.
* **Postcode Search:** Enter a UK postcode to pinpoint its location on an OpenStreetMap rendition.
* **Interactive Map (Leaflet):** Utilizes the Leaflet.js library for a smooth, interactive map experience within the sidebar.
* **Latitude & Longitude Display:** Shows the precise geographical coordinates (latitude and longitude) for the searched location.
* **Clear Functionality:** A button to clear the input field and reset the map view.
* **Context Menu Integration:**
    * Select any text (e.g., a postcode) on a webpage.
    * Right-click to access the context menu.
    * Choose "Map selected text in Postcode Map Viewer" to automatically open the sidebar, populate the search field, and initiate the map search.
* **Open in New Tab:** A button to open the currently displayed location in a new browser tab directly on OpenStreetMap.org for a full-screen view.

## 🚀 Installation

This extension is designed to be loaded as an "unpacked" extension in Microsoft Edge for development or personal use.

1.  **Download/Clone:** Obtain the extension files. If this is a Git repository, clone it:
    ```bash
    git clone https://github.com/SparkyMark66/OSMSidebar
    cd postcode-map-viewer-extension
    ```
    Otherwise, ensure you have all the project files in a single folder on your computer.

2.  **Open Edge Extensions:**
    * Open Microsoft Edge.
    * Navigate to `edge://extensions/` in your address bar.

3.  **Enable Developer Mode:**
    * In the top-right corner of the Extensions page, toggle on **Developer mode**.

4.  **Load Unpacked Extension:**
    * Click the **Load unpacked** button.
    * Select the root directory of your extension (the folder containing `manifest.json`).

5.  **Pin to Toolbar (Optional):**
    * Once loaded, you'll see the extension "Postcode Map Viewer" in your list.
    * To easily access it, click the puzzle piece icon (Extensions menu) in your Edge toolbar.
    * Click the "eye" icon next to "Postcode Map Viewer" to pin its icon directly to the toolbar.

## 🛠️ Usage

1.  **Open the Sidebar:** Click the "Postcode Map Viewer" icon in your Edge toolbar. The sidebar will appear on the right side of your browser window.

2.  **Search by Postcode:**
    * Type a UK postcode (e.g., `SW1A 0AA`, `M1 1AE`) into the text field.
    * Click the "Find" button or press Enter.
    * The map will center on the location, a pin will be dropped, and the Latitude/Longitude will be displayed.

3.  **Clear Search:**
    * Click the "Clear" button to clear the input, remove the pin, and reset the map view.

4.  **Map Selected Text (Context Menu):**
    * On any webpage, select a block of text (e.g., a postcode).
    * Right-click on the selected text.
    * In the context menu that appears, choose "Map selected text in Postcode Map Viewer".
    * The sidebar will open (if not already open), the selected text will be entered into the search field, and the map search will initiate automatically.

5.  **Open in New Tab:**
    * After a successful postcode search, click the "Open in New Tab" button.
    * This will open a new browser tab/window, displaying the pinpointed location on OpenStreetMap.org.

## 📁 Project Structure
├── manifest.json

├── background.js           # Handles context menu and inter-component communication

├── sidebar.html            # UI for the sidebar

├── sidebar.js              # Logic for the sidebar UI and map interaction

├── sidebar.css             # Styling for the sidebar UI

├── icons/                  # Stores extension icons (16x16, 32x32, 48x48, 128x128)

│   ├── icon16.png

│   ├── icon32.png

│   ├── icon48.png

│   └── icon128.png

└── lib/                    # Local library dependencies

└── leaflet/            # Leaflet.js library files

├── images/         # Default Leaflet marker images

│   ├── marker-icon.png

│   ├── marker-icon-2x.png

│   └── marker-shadow.png

├── leaflet.css

└── leaflet.js


## 💻 Technologies Used

* **Microsoft Edge Extensions API (Manifest V3)**
* **HTML5, CSS3, JavaScript**
* **Leaflet.js:** An open-source JavaScript library for mobile-friendly interactive maps.
* **OpenStreetMap (OSM):** Provides the base map data.
* **Nominatim:** OpenStreetMap's geocoding service (used for postcode lookup).

## 📄 License

This project is open-source and available under the MIT License.

---

