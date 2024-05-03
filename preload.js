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

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Home') { 
        document.getElementById('results').innerHTML = ''; 
        document.getElementById('search-bar').value = ''; 
        currentQuery = '';
        reduceWidgetSize();// Reset widget height if needed
        // Optionally hide the back button as well:
        // document.getElementById('back-button').style.display = 'none'; 
    }
});




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
            console.log('jai')
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
    const targetHeight = Math.min(widgetHeight, 550);
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('resize-window', targetHeight); 
  }

  function reduceWidgetSize() {
    const targetHeight = Math.min(widgetHeight, 50);
    const { ipcRenderer } = require('electron');
    ipcRenderer.send('resize-window', targetHeight); 
  }


   const { ipcRenderer } = require('electron');
   let externalWindow = null; 
 
   ipcRenderer.on('link-opened', () => {
     if (externalWindow === null) { 
       externalWindow = new BrowserWindow({ show: false });
     }
     externalWindow.loadURL(item.link); 
   });
});
