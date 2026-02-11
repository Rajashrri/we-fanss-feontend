
import { Outlet } from 'react-router-dom';
import FixedSectionTab from '../pages/Section/FixedSectionTab';

const FixedSectionLayout = () => {
  return (
    <div className="page-content">
     
      <FixedSectionTab />
      
      
      <Outlet />
    </div>
  );
};

export default FixedSectionLayout;