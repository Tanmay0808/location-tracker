import React from 'react';
import './App.css';
import L from 'leaflet';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Creating Map
    var map = L.map('map-box').setView([28.0908,77.8920],4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
     attribution:
         '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
     maxZoom: 20
    }).addTo(map);

    //Adding Events To Buttons
    document.querySelector("#start").addEventListener('click',geoFindTrail);
    document.querySelector("#stop").addEventListener('click',stopTrail);
    document.querySelector("#download").addEventListener('click',downloadData);
    document.querySelector("#github").addEventListener('click',githubRepo);
   
    //Creating A File for to store data in csv
    let watchID, csvContent = "data:text/csv;charset=utf-8,";
    csvContent += ['Latitude','Longitude','Timestamp'].join(',') + '\r\n';

    //Main Function
    function geoFindTrail(){
      if (navigator.geolocation) {
        watchID = navigator.geolocation.watchPosition(function(pos) {
            const coords = [pos.coords.latitude,pos.coords.longitude,pos.timestamp];
            const myloc = document.createElement('div');
            myloc.className = 'alert alert-info';
            myloc.innerHTML = `<strong>Latitude :</strong> ${coords[0]}
                             <strong>Longitude :</strong> ${coords[1]}
                             <strong>Time :</strong> ${Date(coords[2])}`;
            
            //Writing Co-ordinates in csv file
            csvContent += coords.join(",") + '\r\n';
            
            map.setView([coords[0],coords[1]],15);
            L.marker([coords[0],coords[1]]).addTo(map).bindPopup(`Lat : ${coords[0]}
                                              <br> Lon : ${coords[1]}`);
          
            document.querySelector(".footer").innerHTML = '<h2>Location Trail</h2>';
            document.querySelector(".footer").after(myloc);
        },
        //Error Function
        function(error) {
          const div = document.createElement('div');
          div.className = 'alert alert-danger';
          div.innerHTML = `ERROR: ${error.message}. Try Refreshing The Page And Start Again.`;
          document.querySelector('.footer').after(div);
        },
        //Optional Parameter
        {
          enableHighAccuracy:true,
        });
      }
      else{
        alert("Geo Location Not Supported");
      }
    }
    
    //Function to stop trail generation
    function stopTrail(){
      navigator.geolocation.clearWatch(watchID);
    }
    
    //Function to make csv as downloadable file
    function downloadData()
    {
      var encodedUri = encodeURI(csvContent);
      var link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "location_data.csv");
      document.body.appendChild(link);
      link.click();
    }
    
    //Github Repo
    function githubRepo()
    {
      var link = document.createElement("a");
      link.setAttribute("href","https://github.com/Tanmay0808/location-tracker/");
      link.setAttribute("target","_blank");
      document.body.appendChild(link);
      link.click();
    }
  }

  render() {
    return (
      <div className="map-card">
        <div className="header">
          <h2>Location Trail Generator</h2>
          <button id="start">Start</button>
          <button id="stop">Stop</button>
          <button id="download">Download Data</button>
          <button id="github">Github Repo</button>
        </div>
        <div className="map-box" id="map-box"></div>
        <div className="footer">Click On Start Button</div>
      </div>
    );
  }
}

export default App;

