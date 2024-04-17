window.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    searchBar.addEventListener('keyup', handleKeyUp); 
  
    let widgetHeight = 100; 
    let currentQuery = '';
  
    function handleKeyUp(event) {
      if (event.key === 'Enter') { 
        currentQuery = event.target.value;
        displaySimulatedResults(currentQuery);
      }
    }
  
    function displaySimulatedResults(query) {
      const resultsDiv = document.getElementById('results');
      resultsDiv.innerHTML = ''; 
  
      const simulatedResults = ['Result 1 for ' + query, 'Result 2 for ' + query, 'Result 3 for ' + query];
  
      simulatedResults.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.textContent = result;
        resultsDiv.appendChild(resultItem);
  
        widgetHeight += resultItem.offsetHeight; 
        resizeWidget(); 
      });
    }
  
    function resizeWidget() {
      const win = require('electron').remote.getCurrentWindow();
      win.setSize(400, widgetHeight); 
    }
  });
  