import React, { useState, useEffect, useRef } from 'react';

const CBPChargesMap = () => {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const mapContainerRef = useRef(null);
  
  // Hardcoded incident data (extracted from CSV)
  const incidentData = [
    {"lat":32.5769776,"lng":-116.6271396,"defendant":"Jesse Clark Garcia","caseType":"drug trafficking","chargesDate":"5/3/2024","narrative":"CBP agent faces grand jury charges for allegedly coordinating with drug smugglers to allow drugs through ports of entry, including Tecate.","caseStatus":"In progress","sentence":"n/a","source":"https://storage.courtlistener.com/recap/gov.uscourts.casd.790810/gov.uscourts.casd.790810.1.0.pdf"},
    {"lat":32.5525843,"lng":-116.9359025,"defendant":"Diego Bonilla","caseType":"drug trafficking","chargesDate":"5/3/2024","narrative":"CBP agent faces grand jury charges for allegedly coordinating with drug smugglers to allow drugs through ports of entry, including Otay Mesa, and alerted smugglers that they were being tailed by other agents who were covertly trying to find info on stash houses and other associates.","caseStatus":"In progress","sentence":"n/a","source":"https://storage.courtlistener.com/recap/gov.uscourts.casd.790810/gov.uscourts.casd.790810.1.0.pdf"},
    {"lat":31.7500809,"lng":-106.4869612,"defendant":"Manuel Perez Jr.","caseType":"human smuggling","chargesDate":"2/5/2025","narrative":"CBP agent allegedly coordinated with smugglers to allow undocumented migrants into the U.S. at the Paso Del Norte Port of Entry. El Paso Times reported that a federal agent testified that the CBP agent was a member of the La Linea drug trafficking organization.","caseStatus":"In progress","sentence":"n/a","source":"https://www.documentcloud.org/documents/25880278-06e6cb08-543b-4849-a910-a43c55e467e7/"},
    {"lat":32.5442138,"lng":-117.0303764,"defendant":"Leonard Darnell George","caseType":"drug trafficking, human smuggling","chargesDate":"6/28/2023","narrative":"Former CBP agent Leonard Darnell George was sentenced to 23 years in prison for accepting bribes to allow drugs and undocumented migrants across the border.","caseStatus":"Convicted","sentence":"23 years in prison","source":"https://www.documentcloud.org/documents/25880295-archived-cbp-officer-sent-to-prison-for-receiving-bribes-to-allow-drug-laden-vehicles-and-unauthorized-immigrants-to-enter-the-us-ice/"},
    {"lat":31.6726262,"lng":-106.3341631,"defendant":"Omar Moreno","caseType":"human smuggling","chargesDate":"2/26/2024","narrative":"Former CBP agent Omar Moreno was convicted of coordinating with smugglers to illegally cross undocumented migrants into the U.S. at the Ysleta Port of Entry.","caseStatus":"Convicted","sentence":"4 years in prison","source":"https://www.documentcloud.org/documents/25880306-7d196599-bc33-49b1-ab3f-a41d64907d86/"},
    {"lat":32.5442138,"lng":-117.0303764,"defendant":"Farlis Almonte, Ricardo Rodriguez","caseType":"human smuggling","chargesDate":"3/25/2025","narrative":"Two CBP agents allegedly conspired with smugglers to bring undocumented migrants into the U.S. while they were managing vehicle lanes at the San Ysidro Port of Entry.","caseStatus":"In progress","sentence":"n/a","source":"https://www.documentcloud.org/documents/25880443-1/"},
    {"lat":32.2755567,"lng":-112.7416168,"defendant":"Carlos Victor Passapera Pinott","caseType":"drug trafficking","chargesDate":"8/10/2020","narrative":"A former CBP agent in Arizona, assigned to the Ajo Border Patrol Station, was sentenced to 15 years in prison after investigators saw him load duffel bags with heroin, fentanyl, cocaine and 350,000 pills into another car.","caseStatus":"Convicted","sentence":"15 years in prison","source":"https://storage.courtlistener.com/recap/gov.uscourts.azd.1249970/gov.uscourts.azd.1249970.1.0.pdf"},
    {"lat":32.63547814,"lng":-116.9219853,"defendant":"Hector Hernandez","caseType":"drug trafficking","chargesDate":"5/11/2023","narrative":"A Border Patrol agent was convicted after meeting with an undercover DHS agent and agreed to help smuggle migrants across the border for $5,000, which he received during a meeting in the Otay Lakes section of San Diego. Then he agreed to transport meth in a duffle bag for $20,000.","caseStatus":"Convicted","sentence":"7 years in prison","source":"https://www.documentcloud.org/documents/25893646-023b8df5-6488-44ca-9a4c-b2dc51e51304/"},
    {"lat":27.502685,"lng":-99.5026627,"defendant":"Emanuel Isac Celedon","caseType":"drug trafficking, human smuggling","chargesDate":"11/28/2023","narrative":"A Border Patrol agents was convicted of coordinating with Cartel del Noreste to bring drugs and migrants across the border through his inspection lanes at the Lincoln Juarez Port of Entry in Laredo.","caseStatus":"Convicted","sentence":"10 years in prison","source":"https://www.justice.gov/usao-sdtx/pr/former-federal-officer-sentenced-smuggling-aliens-and-receiving-bribes-cartel#:~:text=Emanuel%20Isac%20Celedon%2C%2037%2C%20Laredo,Entry%20(POE)%20in%20Laredo."}
  ];

  useEffect(() => {
    // Set incidents from hardcoded data
    setIncidents(incidentData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && incidents.length > 0 && mapContainerRef.current) {
      // Load Leaflet scripts dynamically
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
      script.onload = initMap;
      
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
      
      document.head.appendChild(link);
      document.head.appendChild(script);
      
      return () => {
        // Cleanup
        if (mapRef.current) {
          mapRef.current.remove();
        }
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
        if (document.head.contains(link)) {
          document.head.removeChild(link);
        }
      };
    }
  }, [loading, incidents]);

  const initMap = () => {
    if (!window.L || !mapContainerRef.current) return;
    
    // Check if map already exists
    if (mapRef.current) {
      mapRef.current.remove();
    }
    
    // Initialize map with a default view of the US-Mexico border region
    const map = window.L.map(mapContainerRef.current).setView([32.0, -112.0], 6);
    mapRef.current = map;
    
    // Add OpenStreetMap tiles
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Calculate bounds to fit all markers
    const bounds = window.L.latLngBounds();
    
    // Add markers for each incident
    incidents.forEach(incident => {
      const marker = window.L.marker([incident.lat, incident.lng]).addTo(map);
      bounds.extend([incident.lat, incident.lng]);
      
      // Create popup content
      const popupContent = `
        <div style="max-width: 300px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px;">${incident.defendant}</h3>
          <p style="margin: 4px 0;"><strong>Case Type:</strong> ${incident.caseType}</p>
          <p style="margin: 4px 0;"><strong>Charges Filed:</strong> ${incident.chargesDate}</p>
          <p style="margin: 4px 0;"><strong>Narrative:</strong> ${incident.narrative}</p>
          <p style="margin: 4px 0;"><strong>Case Status:</strong> ${incident.caseStatus}</p>
          <p style="margin: 4px 0;"><strong>Sentence:</strong> ${incident.sentence}</p>
          <p style="margin: 4px 0;">
            <strong>Source:</strong> 
            ${incident.source ? 
              `<a href="${incident.source}" target="_blank" rel="noopener noreferrer">View Source</a>` : 
              'N/A'}
          </p>
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });
    
    // Try to fit the map to show all markers
    try {
      // Only try to fit bounds if we have valid coordinates
      if (incidents.length > 0 && typeof bounds.isValid === 'function' && bounds.isValid()) {
        map.fitBounds(bounds, { 
          padding: [50, 50],
          maxZoom: 7  // Limit how far it can zoom in
        });
      } else {
        // Fallback - zoom out to show the southwestern US
        map.setView([32.0, -112.0], 6);
      }
    } catch (e) {
      console.error("Error fitting bounds:", e);
      // Fallback - zoom out to show the southwestern US
      map.setView([32.0, -112.0], 6);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="bg-blue-800 text-white p-2 shadow">
        <h2 className="text-lg font-bold">Federal charges against U.S. CBP agents for drug trafficking and human smuggling</h2>
        <p className="text-sm">Data compiled manually. Coding by Claude.ai. Last updated April 13, 2025.</p>
        {loading && <span className="text-sm ml-2">Loading incident data...</span>}
      </div>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-2 rounded">
          Error: {error}
        </div>
      )}
      
      <div 
        ref={mapContainerRef} 
        className="w-full rounded border border-gray-300"
        style={{ height: 'calc(100vh - 60px)' }}
      ></div>
      
      <div className="text-xs text-gray-600 px-2">
        Displaying {incidents.length} incidents. Click on markers to view details.
      </div>
    </div>
  );
};

export default CBPChargesMap;