import React, { useState } from 'react';
import Navbars from './Navbar';
import DailyCount from './DailyCount';

const ParentDaily = () => {
    const [selectedHospital, setSelectedHospital] = useState('All Hospitals');

    return (
        <div>
            <Navbars 
                selectedHospital={selectedHospital} 
                setSelectedHospital={setSelectedHospital} 
            />
            <DailyCount 
                selectedHospital={selectedHospital} 
            />
        </div>
    );
};

export default ParentDaily;