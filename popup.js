// popup.js

// Function to create a list item with download button and hover preview
function createListItem(file) {
  const li = document.createElement("li");

  const link = document.createElement("a");
  link.href = file.url;
  link.textContent = file.filename;
  link.target = "_blank"; // Open image in a new tab
  link.dataset.url = file.url; // Store URL for preview

  const downloadButton = document.createElement("button");
  downloadButton.textContent = "Download";

  downloadButton.addEventListener("click", () => {
    chrome.downloads.download({ url: file.url, filename: file.filename });
  });

  // Event listeners for hover preview
  link.addEventListener("mouseenter", showPreview);
  link.addEventListener("mouseleave", hidePreview);

  li.appendChild(link);
  li.appendChild(downloadButton);
  return li;
}

// Function to load and display image files
function loadImageFiles() {
  chrome.runtime.sendMessage({ action: "getImageFiles" }, (imageFiles) => {
    const imageList = document.getElementById("imageList");
    imageList.innerHTML = "";

    if (imageFiles.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.textContent = "No image files captured.";
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.color = "#777";
      imageList.appendChild(emptyMessage);
      return;
    }

    // Sort image files alphabetically by filename
    imageFiles.sort((a, b) => a.filename.localeCompare(b.filename));

    imageFiles.forEach((file) => {
      const li = createListItem(file);
      imageList.appendChild(li);
    });
  });
}

// Event listener for the "Clear List" button
document.getElementById("clearButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "clearImageFiles" }, (response) => {
    if (response.success) {
      loadImageFiles();
    } else {
      console.error("Failed to clear image files.");
    }
  });
});

// Event listener for the "Refresh" button
document.getElementById("refreshButton").addEventListener("click", () => {
  loadImageFiles();
});

// Functions to handle image preview
function showPreview(event) {
  const imageUrl = event.target.dataset.url;
  const previewImage = document.getElementById("previewImage");
  previewImage.src = imageUrl;
  previewImage.style.display = "block";
}

function hidePreview() {
  const previewImage = document.getElementById("previewImage");
  previewImage.src = "";
  previewImage.style.display = "none";
}

// Initial load
document.addEventListener("DOMContentLoaded", loadImageFiles);
