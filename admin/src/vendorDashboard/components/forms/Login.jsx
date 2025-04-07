import React, {useState} from 'react'
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';
import Loader from "../Loader";
import axios from "axios";
import { BASE_URL } from "../../../api/api";
import { ValidateEmail } from "../../../utils/validateEmail";


const Login = ({showWelcomeHandler, showRegisterHandler}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false)
  const [debugInfo, setDebugInfo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleShowPassword = ()=>{
    setShowPassword(!showPassword);
  }
  

  const loginHandler = async(e)=>{
      e.preventDefault();
      setLoading(true); 
      setDebugInfo("Attempting login to: " + API_URL);
      try {
          console.log("Attempting to login with API URL:", API_URL);
          const response = await fetch(`${API_URL}/vendor/login`, {
            method: 'POST',
            headers:{
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
          
          console.log("Login response status:", response.status);
          setDebugInfo(prev => prev + "\nResponse status: " + response.status);
          
          const data = await response.json();
          console.log("Login response data:", data);
          
          if(response.ok){
            localStorage.setItem('loginToken', data.token);
            
            const vendorId = data.vendorId;
            console.log("checking for VendorId:", vendorId);
            setDebugInfo(prev => prev + "\nVendor ID: " + vendorId);
            
            // Get vendor details first before reloading
            try {
              setDebugInfo(prev => prev + "\nFetching vendor details...");
              const vendorResponse = await fetch(`${API_URL}/vendor/single-vendor/${vendorId}`);
              console.log("Vendor details response status:", vendorResponse.status);
              setDebugInfo(prev => prev + "\nVendor response: " + vendorResponse.status);
              
              const vendorData = await vendorResponse.json();
              console.log("Vendor details:", vendorData);
              
              if(vendorResponse.ok){
                // Only set firm data if the vendor has firms
                if (vendorData.hasFirm && vendorData.vendorFirmId) {
                  localStorage.setItem('firmId', vendorData.vendorFirmId);
                  setDebugInfo(prev => prev + "\nFirm ID set: " + vendorData.vendorFirmId);
                  
                  if (vendorData.vendor.firm && vendorData.vendor.firm.length > 0) {
                    localStorage.setItem('firmName', vendorData.vendor.firm[0].firmName);
                    setDebugInfo(prev => prev + "\nFirm name set: " + vendorData.vendor.firm[0].firmName);
                  }
                } else {
                  setDebugInfo(prev => prev + "\nNo firm data available");
                }
                
                alert('Login success');
                setEmail("");
                setPassword("");
                showWelcomeHandler();
                // Reload page after all data is set
                setTimeout(() => {
                  window.location.reload();
                }, 1000);
              } else {
                setDebugInfo(prev => prev + "\nError: " + (vendorData.error || "Failed to fetch vendor data"));
                throw new Error(vendorData.error || "Failed to fetch vendor data");
              }
            } catch (vendorError) {
              console.error("Error fetching vendor data:", vendorError);
              setDebugInfo(prev => prev + "\nError: " + vendorError.message);
              alert('Login successful, but failed to load your firm data. You may need to add a firm.');
              showWelcomeHandler();
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          } else {
            setDebugInfo(prev => prev + "\nLogin failed: " + (data.error || "Unknown error"));
            alert("Login failed: " + (data.error || "Unknown error"));
          }
      } catch (error) {
          console.error("Login error:", error);
          setDebugInfo(prev => prev + "\nError: " + error.message);
          alert("Login failed. Please try again.");
      } finally {
        setLoading(false); 
      }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Email is required");
      setLoading(false);
      return;
    }

    if (!ValidateEmail(email)) {
      setErrorMessage("Email is not valid");
      setLoading(false);
      return;
    }

    if (!password) {
      setErrorMessage("Password is required");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password should be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      if (response?.data?.error) {
        setErrorMessage(response.data.error);
        setLoading(false);
        return;
      }

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("id", response.data.id);
      localStorage.setItem("fullName", response.data.fullName);
      localStorage.setItem("userType", response.data.userType);
      localStorage.setItem("vendor", JSON.stringify(response.data.vendor));

      window.location.reload();
    } catch (err) {
      setErrorMessage(err?.response?.data?.error || "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="loginSection">
      {loading && (
        <div className="loaderSection">
          <Loader />
          <p>Login in process... Please wait</p>
          <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666'}}>
            {debugInfo.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
      {!loading && (
        <form className='authForm' onSubmit={handleSubmit} autoComplete='off'>
          <h3>Vendor Login</h3>
          {errorMessage && (
            <div
              style={{
                color: "var(--color-danger)",
                fontSize: "14px",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {errorMessage}
            </div>
          )}
          <label>Email</label>
          <input type="text" name='email' value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='enter your email'/><br />
          <label>Password</label>
          <input type={showPassword? "text":"password"} name='password' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='enter your password'/><br />
          <span className='showPassword' onClick={handleShowPassword}>
            {showPassword ? 'Hide' : 'Show'}
          </span>
          <div className="btnSubmit">
            <button type='submit'>Submit</button>
          </div>
          
          <div className="auth-switch">
            Don't have an account? <span onClick={showRegisterHandler}>Register here</span>
          </div>
        </form>
      )}
    </div>
  )
}

export default Login