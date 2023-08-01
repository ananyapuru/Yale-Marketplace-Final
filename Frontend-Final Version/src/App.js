import logo from './logo.svg';
import './App.css';
import Login from './pages/Login';
import Home from './pages/Home';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddObject from './pages/AddObject';
import Object from './pages/Object';
import Wishlist from './pages/Wishlist';
import PrivateRoute from './components/PrivateRoute';
import Listing from './pages/Listing';
import UpdateObject from './pages/UpdateObject';
import ParallaxStarBackground from './components/ParallaxStarBackground';
import { Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="App">
    <ParallaxStarBackground />
    <BrowserRouter>
        {/* {isConnected
          ? 
          <HeaderComponent />
          :
          null
        } */}
        <Routes>
          <Route path="/login" element={<Login/>}  />
          <Route path="/home" element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>
          }  />
          <Route path="/objects/:object_id" element={
            <PrivateRoute>
              <Object/>
            </PrivateRoute>
          
          }  />

          <Route path="/updateObject/:object_id" element={
            <PrivateRoute>
              <UpdateObject/>
            </PrivateRoute>
          
          }  />

          <Route path="/addObject" element={
            <PrivateRoute>
              <AddObject/>
            </PrivateRoute>
          
          }  />
          <Route path="/wishlist" element={
            <PrivateRoute>
              <Wishlist/>
            </PrivateRoute>
          
          }  />
          <Route path="/listing" element={
            <PrivateRoute>
              <Listing/>
            </PrivateRoute>
          
          }  />
          
          <Route path="*" element={<Navigate to="/home" replace />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
