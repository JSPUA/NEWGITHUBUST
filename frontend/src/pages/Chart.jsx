import React, { useState, useEffect } from 'react';
import { VictoryArea,VictoryBar, VictoryChart, VictoryAxis, VictoryTheme,VictoryPie,VictoryTooltip,VictoryLabel } from 'victory';
import Navbars from './Navbar';

const Example = () => {
  const [stentData, setStentData] = useState({ male: { expired: 0 }, female: { expired: 0 } });
  const [stentDataByAge, setStentDataByAge] = useState({});
  const [stentDataByEthnicity, setStentDataByEthnicity] = useState({});
  const [stentDataByHospital, setStentDataByHospital] = useState({});
  const [stentInsertionsByGender, setStentInsertionsByGender] = useState([]);
  const [stentInsertionsByEthnicity, setStentInsertionsByEthnicity] = useState([]);
  const [stentInsertionsByHospital, setStentInsertionsByHospital] = useState([]);
  const [stentInsertionsByAgeRange, setStentInsertionsByAgeRange] = useState([]);

  useEffect(() => {
    // Fetch stent data from your API
    const fetchStentData = async () => {
      try {
        const response = await fetch('http://localhost:5555/getFotgottenStentPatientsGender2');
        const data = await response.json();
        setStentData(data.stentStatusCounts);
      } catch (error) {
        console.error('Error fetching stent data:', error);
      }
    };

    

    

    fetchStentData();
  }, []);

  useEffect(() => {
    // Fetch stent data from your API
    const fetchStentDataByAge = async () => {
      try {
        const response2 = await fetch('http://localhost:5555/getFotgottenStentPatientsAge');
        const data = await response2.json();
        setStentDataByAge(data.stentStatusCountsByAge);
      } catch (error) {
        console.error('Error fetching stent data:', error);
      }
    };

    fetchStentDataByAge();
  }, []);

  useEffect(() => {
    // Fetch stent data by ethnicity from your API
    const fetchStentDataByEthnicity = async () => {
      try {
        const response = await fetch('http://localhost:5555/getForgottenStentPatientsByEthnicity');
        const data = await response.json();
        setStentDataByEthnicity(data.stentStatusCountsByEthnicity);
      } catch (error) {
        console.error('Error fetching stent data by ethnicity:', error);
      }
    };
  
    fetchStentDataByEthnicity();
  }, []);



  useEffect(() => {
    const fetchStentDataByHospital = async () => {
      try {
        const response = await fetch('http://localhost:5555/getForgottenStentPatientsByHospital');
        const data = await response.json();
        setStentDataByHospital(data.stentStatusCountsByHospital);
      } catch (error) {
        console.error('Error fetching stent data by hospital:', error);
      }
    };
  
    fetchStentDataByHospital();
  }, []);

  useEffect(() => {
    const fetchStentInsertionsByGender = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByGender');
        const data = await response.json();
        setStentInsertionsByGender(data);
      } catch (error) {
        console.error('Error fetching stent insertions by gender:', error);
      }
    };

    fetchStentInsertionsByGender();
  }, []);

  useEffect(() => {
    const fetchStentInsertionsByEthnicity = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByEthnicity');
        const data = await response.json();
        setStentInsertionsByEthnicity(data);
      } catch (error) {
        console.error('Error fetching stent insertions by ethnicity:', error);
      }
    };

    fetchStentInsertionsByEthnicity();
  }, []);


  useEffect(() => {
    const fetchStentInsertionsByHospital = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByHospital');
        const data = await response.json();
        setStentInsertionsByHospital(data);
      } catch (error) {
        console.error('Error fetching stent insertions by hospital:', error);
      }
    };

    fetchStentInsertionsByHospital();
  }, []);


  useEffect(() => {
    const fetchStentInsertionsByAgeRange = async () => {
      try {
        const response = await fetch('http://localhost:5555/stentInsertionsByAgeRange');
        const data = await response.json();
        data.sort((a, b) => {
          // Assuming age ranges are strings like '0-10', '11-20', etc.
          const rangeA = parseInt(a._id.split('-')[0], 10);
          const rangeB = parseInt(b._id.split('-')[0], 10);
          return rangeA - rangeB;
        });
        setStentInsertionsByAgeRange(data);
      
      } catch (error) {
        console.error('Error fetching stent insertions by age range:', error);
      }
    };

    fetchStentInsertionsByAgeRange();
  }, []);

  //stentData.male.expired stentData.female.expired
  const stentChartData = [
    { gender: 'Male', expired: stentData.male.expired  },
    { gender: 'Female', expired:stentData.female.expired  },
  ];

  

  const stentAgeChartData = Object.keys(stentDataByAge).map((ageRange) => {
    return { ageRange, expired: stentDataByAge[ageRange] };
  });

  const stentEthnicityChartData = Object.keys(stentDataByEthnicity).map(ethnicity => {
    return { ethnicity, expired: stentDataByEthnicity[ethnicity] };
  });

  const stentHospitalChartData = Object.keys(stentDataByHospital).map(hospital => {
    return { hospital, expired: stentDataByHospital[hospital] };
  });

  const stentInsertionsChartData = stentInsertionsByGender.map(item => {
    return { gender: item._id, count: item.count };
  });

  const stentInsertionsEthnicityChartData = stentInsertionsByEthnicity.map(item => {
    return { ethnicity: item._id, count: item.count };
  });

  const stentInsertionsHospitalChartData = stentInsertionsByHospital.map(item => {
    return { hospital: item._id, count: item.count };
  });

  const stentInsertionsAgeChartData = stentInsertionsByAgeRange.map(item => {
    return { ageRange: item._id, count: item.count };
  });


  return (
    <div>
      <Navbars/>
<h1>Stent Insertion Chart</h1>
<div style={{ display: 'flex', justifyContent: 'space-around' }}>
  
<div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
          <VictoryLabel 
            text="Stent Insertions by Gender" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsChartData}
            innerRadius={50}
            x="gender"
            y="count"
            colorScale={["cyan", "tomato"]}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.gender}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>

        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
          <VictoryLabel 
            text="Stent Insertions by Ethnicity" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "quad" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsEthnicityChartData}
            innerRadius={50}
            x="ethnicity"
            y="count"
            colorScale={"cool"}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.ethnicity}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>


  

  </div>
  <br></br>
  <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      
        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
          <VictoryLabel 
            text="Stent Insertions by Hospital" 
            x={200} 
            y={30} 
            textAnchor="middle"
            style={{ fontSize: 20 }}
          />
          <VictoryPie
           animate={{
            duration: 2000, // Duration of the animation in milliseconds
            easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
          }}
            padAngle={({ datum }) => 6}
            data={stentInsertionsHospitalChartData}
            innerRadius={50}
            x="hospital"
            y="count"
            colorScale={"warm"}
            labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.hospital}: ${datum.count}`}
            style={{
                data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
                labels: { fontSize: 14, fill: "black" },
                parent: { maxWidth: '100%' }
            }}
          />
        </div>

        <div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
        <VictoryLabel 
          text="Stent Insertions by Age Range" 
          x={400} // Adjusted for center alignment
          y={30} 
          textAnchor="middle"
          style={{ fontSize: 20 }}
        />
        <VictoryChart
          domainPadding={20}
          theme={VictoryTheme.material}
          style={{ parent: { maxWidth: '100%' } }}
        >
          <VictoryAxis
            // You can use tickValues and tickFormat if you want specific labels on the x-axis
            label="Age Range"
            style={{
              axisLabel: { padding: 30 },
              tickLabels: { fontSize: 12, padding: 5, angle: -45 } // Angle the labels for better readability
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Count"
            style={{
              axisLabel: { padding: 40 },
              tickLabels: { fontSize: 12, padding: 5 }
            }}
          />
          <VictoryBar
            data={stentInsertionsAgeChartData}
            x="ageRange"
            y="count"
            labelComponent={<VictoryTooltip flyoutStyle={{ stroke: "none", fill: "white" }} />}
            labels={({ datum }) => `${datum.ageRange}: ${datum.count}`}
            style={{
              data: { fill: "blue" }
            }}
            animate={{
              duration: 2000,
              onLoad: { duration: 1000 }
            }}
          />
        </VictoryChart>
      </div>
    
      </div>







      <h1>Expired Stent Count by Gender</h1>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
  

      
      <div style={{ maxWidth: '800px',maxHeight: '500px',background: "grey" , borderRadius: "20px" }}> 
      <VictoryLabel 
        text="No. of Forgotten Stent Removement Patient by Gender" 
        x={200} 
        y={30} 
        textAnchor="middle"
        style={{ fontSize: 20 }}
      />
<VictoryPie
 animate={{
  duration: 2000, // Duration of the animation in milliseconds
  easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
}}
 padAngle={({ datum }) => 6}
        data={stentChartData}
        innerRadius={50}
        x="gender"
        y="expired"
        
        
        colorScale={["cyan", "tomato"]}
       
        labelComponent={<VictoryTooltip 
            style={{ fontSize: 30 }} // Set the font size for the tooltip text here
            flyoutStyle={{ stroke: "none", fill: "white" }} />}

        labels={({ datum }) => `${datum.gender}: ${datum.expired}`}
        style={{
            data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
            labels: { fontSize: 14, fill: "black" },
            parent: { maxWidth: '100%' }
          }}
      />
      </div>

      <div style={{ maxWidth: '800px' ,maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
      <VictoryLabel 
          text="No. of Forgotten Stent Removement Patient by Age" 
          x={200} 
          y={30} 
          textAnchor="middle"
          style={{ fontSize: 25 }}
        />

      <VictoryChart
      
        domainPadding={20}
        theme={VictoryTheme.material}
        style={{ parent: { maxWidth: '100%' } }}
      >
       

        <VictoryAxis
          tickValues={stentAgeChartData.map(data => data.ageRange)}
          tickFormat={stentAgeChartData.map(data => data.ageRange)}
          label="Age Range"
          style={{
            axisLabel: { padding: 30 },
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />

        <VictoryAxis
          dependentAxis
          tickFormat={(x) => (`${x}`)}
          label="No. of Forgotten Stent Removement Patients"
          style={{
            axisLabel: { padding: 40 },
            tickLabels: { fontSize: 10, padding: 5 }
          }}
        />

        <VictoryBar
          data={stentAgeChartData}
          x="ageRange"
          y="expired"
          labelComponent={<VictoryTooltip flyoutStyle={{ stroke: "none", fill: "white" }}/>}
          labels={({ datum }) => `${datum.ageRange}: ${datum.expired}`}
          style={{ data: { fill: "tomato" } }}
        />
      </VictoryChart>
      </div>
    
      </div>
<br></br>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
  <VictoryLabel 
    text="No. of Forgotten Stent Removement Patient by Ethnicity" 
    x={200} 
    y={30} 
    textAnchor="middle"
    style={{ fontSize: 20 }}
  />
  <VictoryPie
   animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
    padAngle={({ datum }) => 6}
    data={stentEthnicityChartData}
    innerRadius={50}
    x="ethnicity"
    y="expired"
    colorScale={"cool"}
    labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
    labels={({ datum }) => `${datum.ethnicity}: ${datum.expired}`}
    style={{
        data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
        labels: { fontSize: 14, fill: "black" },
        parent: { maxWidth: '100%' }
    }}
  />
</div>
      <div style={{ maxWidth: '800px', maxHeight: '500px', background: "grey", borderRadius: "20px" }}>
  <VictoryLabel 
    text="No. of Forgotten Stent Removement Patient by Hospital" 
    x={200} 
    y={30} 
    textAnchor="middle"
    style={{ fontSize: 20 }}
  />
  <VictoryPie
   animate={{
    duration: 2000, // Duration of the animation in milliseconds
    easing: "bounce" // Easing type (e.g., "linear", "quad", "cubic", "bounce", etc.)
  }}
    padAngle={({ datum }) => 6}
    data={stentHospitalChartData}
    innerRadius={50}
    x="hospital"
    y="expired"
    colorScale={"warm"}
    labelComponent={<VictoryTooltip style={{ fontSize: 20 }} flyoutStyle={{ stroke: "none", fill: "white" }} />}
    labels={({ datum }) => `${datum.hospital}: ${datum.expired}`}
    style={{
        data: { fillOpacity: 0.8, stroke: "white", strokeWidth: 2 },
        labels: { fontSize: 14, fill: "black" },
        parent: { maxWidth: '100%' }
    }}
  />
</div>
    
</div>

    </div>
  );
};

export default Example;
