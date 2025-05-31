// This script runs in the background of your extension.

// --- Context Menu Creation ---
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.remove("mapSelectedPostcode", () => {
    chrome.contextMenus.create({
      id: "mapSelectedPostcode",
      title: "Map selected text in Postcode Map Viewer",
      contexts: ["selection"]
    });
    console.log("Context menu item 'mapSelectedPostcode' created/updated.");
  });
});

// --- Helper function to send message to sidebar with retries ---
// It will try to send the message up to 'maxRetries' times with a 'delayMs' between attempts.
const sendMessageToSidebarWithRetry = (postcode, maxRetries = 5, delayMs = 200) => {
  let retries = 0;

  const attemptSendMessage = () => {
    chrome.runtime.sendMessage({
      action: "mapPostcode",
      postcode: postcode
    }, (response) => {
      if (chrome.runtime.lastError) {
        // Error occurred, sidebar probably not ready
        console.warn(`Attempt ${retries + 1}/${maxRetries} failed to send message: ${chrome.runtime.lastError.message}. Retrying...`);
        retries++;
        if (retries < maxRetries) {
          setTimeout(attemptSendMessage, delayMs); // Retry after delay
        } else {
          console.error("Failed to send message to sidebar after maximum retries.");
          // You could add a notification here to inform the user
          // chrome.notifications.create({ /* ... */ });
        }
      } else {
        // Message sent successfully
        console.log("Message sent to sidebar, response:", response);
      }
    });
  };

  attemptSendMessage(); // Start the first attempt
};


// --- Context Menu Click Listener ---
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "mapSelectedPostcode" && info.selectionText) {
    const selectedPostcode = info.selectionText.trim();
    console.log(`Context menu clicked. Processed selected text: "${selectedPostcode}"`);

    if (!selectedPostcode) {
      console.warn("Selected text is empty after trimming. Not proceeding with search.");
      return;
    }

    // --- Attempt to open the side panel ---
    // Try chrome.sidePanel.open() first (more direct, requires Chrome/Edge 116+)
    if (chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
      chrome.sidePanel.open({ tabId: tab.id })
        .then(() => {
          console.log(`Side panel explicitly opened for tab: ${tab.id}.`);
          sendMessageToSidebarWithRetry(selectedPostcode); // Call with retry logic
        })
        .catch(error => {
          console.error("Failed to explicitly open side panel (open() method):", error);
          // Fallback to setOptions if open() fails
          chrome.sidePanel.setOptions({ tabId: tab.id, enabled: true })
            .then(() => {
              console.log(`Side panel enabled via setOptions for tab: ${tab.id}.`);
              sendMessageToSidebarWithRetry(selectedPostcode); // Call with retry logic
            })
            .catch(err => {
              console.error("Failed to enable side panel via setOptions (fallback):", err);
            });
        });
    } else {
      // Fallback for older browser versions where chrome.sidePanel.open() is not available.
      console.log("chrome.sidePanel.open() not available. Falling back to setOptions.");
      chrome.sidePanel.setOptions({
        tabId: tab.id,
        enabled: true
      })
      .then(() => {
        console.log(`Side panel enabled via setOptions for tab: ${tab.id}.`);
        sendMessageToSidebarWithRetry(selectedPostcode); // Call with retry logic
      })
      .catch(error => {
        console.error("Failed to enable side panel via setOptions (direct fallback):", error);
      });
    }
  }
});