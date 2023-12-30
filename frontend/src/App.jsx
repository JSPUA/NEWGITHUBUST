import React from 'react'
import {Routes, Route}from 'react-router-dom'
import Home from './pages/Home'
import CreateBook from './pages/CreateBook'
import ShowBook from './pages/ShowBook'
import DeleteBook from './pages/DeleteBook'
import EditBook from './pages/EditBook'
import BookList from './pages/BookList'
import LoginPage from './pages/LoginPage'
import ForgetPassword from './pages/ForgetPassword'
import Signup from './pages/Signup'
import Upload from './pages/upload'
import ApplyList from './pages/ApplyList'
import SpecificApplyInfo from './pages/specificApplyInfo'
import DeleteApplyList from './pages/ApplyDelete'
import TableWithSearch from './pages/Sampletable'
import UploadPDF from './pages/uploadPDF'
import ResearchList from './pages/ResearchList'
import PDFViewerPage from './pages/PDFViewerPage'
import PDFViewer from './pages/PDFViewer'
import AddPicture from './pages/AddPicture'
import ShowPicture from './pages/ShowPicture'
import UpdatePicture from './pages/UpdatePicture'
import DeletePicture from './pages/DeletePicture'
import AddPatient from './pages/AddPatient'
import AddPatientPassword from './pages/AddPatientPassword'
import PatientList from './pages/PatientList'
import SpecificPatientInfo from './pages/specificPatientInfo'
import UpdatePatient from './pages/UpdatePatient'
import AddStentRecord from './pages/AddStent'
import StentRecordTable from './pages/stentRecordTables'
import Combine from './pages/combine'
import AddStent from './pages/newAddStent'
import PatientStent from './pages/PatientStent'
import StentDataPage from './pages/StentDataPage'
import StentRecordPage from './pages/StentRecordPage'
import SendEmailButton from './pages/SendEmailButton'
import RolePermission from './pages/rolePermission'
import DoctorPage from './pages/doctorPage'
import PatientPage from './pages/patientPage'
import AdminPage from './pages/adminPage'
import SuperAdmin from './pages/superAdmin'
import MainPage from './pages/MainPage'
import HospitalList from './pages/testHospital'
import HospitalPatientList from './pages/HospitalPatientList'
import HospitalUserList from './pages/HospitalUserList'
import HospitalUserApplication from './pages/HospitalUserApplication'
import SpecificUserInfo from './pages/specificUserInfo'
import YourComponent from './pages/Navbarwithdropdwon'
import UpdateUser from './pages/UpdateUser'
import ProfileInfo from './pages/ProfileInfo'
import ProfileEdit from './pages/ProfileEdit'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/mainPage' element={<MainPage/>}/>
      <Route path='/booklist' element={<BookList/>}/>
      <Route path='/login' element={<LoginPage/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/books/create' element={<CreateBook/>}/>
      <Route path='/books/details/:id' element={<ShowBook/>}/>
      <Route path='/books/edit/:id' element={<EditBook/>}/>
      <Route path='/books/delete/:id' element={<DeleteBook/>}/>
      <Route path='/forgetpassword' element={<ForgetPassword/>}/>
      <Route path='/upload' element={<Upload/>}/>
      <Route path='/applyList' element={<ApplyList/>}/>
      <Route path='/applyListFilter' element={<ApplyList/>}/>
      <Route path='/get-image/details/:id' element={<SpecificApplyInfo/>}/>
      <Route path='/get-image/delete/:id' element={<DeleteApplyList/>}/>
      <Route path='/sampleTable' element={<TableWithSearch/>}/>
      <Route path='/uploadPDF' element={<UploadPDF/>}/>
      <Route path='/researchList' element={<ResearchList/>}/>
      
      <Route path="/pdf/:id" element={<PDFViewer />} />

      <Route path="/addPic" element={<AddPicture/>} />
      <Route path="/showPic" element={<ShowPicture/>} />
      <Route path="/updatePic/:id" element={<UpdatePicture/>} />
      <Route path="/deletePic/:id" element={<DeletePicture/>} />
      <Route path="/addPatient" element={<AddPatient/>} />
     
      <Route path="/showPatient" element={<PatientList/>} />
      <Route path="/showPatientByID/:id" element={<SpecificPatientInfo/>} />
      <Route path="/updatePatientByID/:id" element={<UpdatePatient/>} />
      <Route path="/updateUser/:id" element={<UpdateUser/>} />
      <Route path="/addStent" element={<AddStentRecord/>} />
      <Route path="/showStent" element={<StentRecordTable/>} />
      <Route path="/addStent/:id" element={<AddStent/>} />
      <Route path="/patientStent" element={<PatientStent/>} />
      <Route path="/showStent/:id" element={<StentDataPage/>} />
      <Route path="/getStent/:id/:stentIndex" element={<StentRecordPage/>} />
      <Route path="/sendEmail" element={<SendEmailButton/>} />
      <Route path="/rolePermission" element={<RolePermission/>} />
      <Route path="/doctorPage" element={<DoctorPage/>} />
      {/* <Route path="/patientPage" element={<PatientPage/>} /> */}
      <Route path="/adminPage" element={<AdminPage/>} />
      <Route path="/superAdminPage" element={<SuperAdmin/>} />
      <Route path="/patientPage/:firstName" element={<PatientPage/>} />
      <Route path="/hospitalList" element={<HospitalList/>} />
      {/* <Route path='/viewPDF' element={<ViewPDF/>}/> */}
      <Route path="/patient-list" element={<HospitalPatientList/>} />
      <Route path="/user-list" element={<HospitalUserList/>} />
      <Route path="/application-list" element={<HospitalUserApplication/>} />
      <Route path="/user/details/:id" element={<SpecificUserInfo/>} />
      <Route path="/superAdmin" element={<YourComponent/>} />
      <Route path="/profileInfo" element={<ProfileInfo/>} />
      <Route path="/profileInfo/edit" element={<ProfileEdit/>} />
    </Routes>
  )
}

export default App