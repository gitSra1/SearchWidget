window.addEventListener('DOMContentLoaded', () => {
  const searchBar = document.getElementById('search-bar');
  searchBar.addEventListener('keyup', handleKeyUp);

  let widgetHeight = 50; 
  let currentQuery = '';

  function handleKeyUp(event) {
    if (event.key === 'Enter') { 
      currentQuery = event.target.value;
      displaySearchResults(currentQuery);
    }
  }

  function displaySearchResults(query) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = 'Loading...';

    fetch(`https://www.googleapis.com/customsearch/v1?key=AIzaSyBURjn2tNwFHVA3RyV6fmtrKSmm8Ciu0zs&cx=52e0019624ede42b7&q=${query}`)
      .then(response => response.json())
      .then(data => {
        resultsDiv.innerHTML = '';
        if (data.items) {
          data.items.forEach(item => {
            const resultItem = document.createElement('div');
            resultItem.innerHTML = `<a href="${item.link}">${item.title}</a>`; 
            resultsDiv.appendChild(resultItem);

            widgetHeight += resultItem.offsetHeight;
            resizeWidget();
          });
        } else {
          resultsDiv.innerHTML = 'No results found.';
        }
      })
      .catch(error => {
        resultsDiv.innerHTML = 'An error occurred.'; 
        console.error('Search Error:', error); 
      });
  }

  function resizeWidget() {
    const targetHeight = Math.min(widgetHeight, 550); // Cap height at 550
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('resize-window', targetHeight); 
  }

   // Back Button and External Link Handling
   const { ipcRenderer } = require('electron');
   let externalWindow = null; // Initialize externalWindow
 
   ipcRenderer.on('toggle-back-button', (event, visibility) => {
     const backButton = document.getElementById('back-button');
     backButton.style.display = visibility ? 'block' : 'none'; 
   });
 
   ipcRenderer.on('link-opened', () => {
     if (externalWindow === null) { 
       externalWindow = new BrowserWindow({ show: false });
     }
     externalWindow.loadURL(item.link); // Load the link sent from preload.js
   });
 
   externalWindow.webContents.on('did-navigate', () => {
     externalWindow.show();
     const mainWindow = BrowserWindow.getFocusedWindow();
     mainWindow.webContents.send('toggle-back-button', externalWindow.webContents.canGoBack());
   });
 
   externalWindow.webContents.on('will-navigate', (event, url) => {
     event.preventDefault();
     mainWindow.webContents.send('toggle-back-button', externalWindow.webContents.canGoBack());
   });
 
   ipcMain.on('back-to-search', () => {
     if (externalWindow) externalWindow.close(); 
     externalWindow = null; // Reset
     const mainWindow = BrowserWindow.getFocusedWindow();
     mainWindow.show();
     mainWindow.focus();
   });
});
