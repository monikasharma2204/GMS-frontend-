import './App.css';
import NavBar from './component/NavBar/NavBar.jsx';
import CompanyProfile from './Page/Company/CompanyProfile.jsx';
import Header from './component/Layout/Header.jsx';
import Footer from './component/Layout/Footer.jsx';
import PurchaseBody from './component/PurchasePage.jsx'
import CompanyProHeader from './component/CompanyProfile/CompanyProfileHeader.jsx'
import CompanyProfileBody from './component/CompanyProfile/CompanyProfileBody.jsx';
import UserAndPermission from './Page/User&Per/UserAndPermission.jsx';
import Test from './ของที่ทำคราวก่อนและไว้เทส code/Test.jsx'
import TablePermission from './component/UserAndPermission/TablePermission/TablePermission.jsx';

function App() {
  return (
    <>
       <CompanyProfile/>  
       <UserAndPermission/>
       <TablePermission/>
      <Test />
    </>
  );
}

export default App;
