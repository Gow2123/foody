import React, {useState} from 'react'
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';


const Login = ({showWelcomeHandler}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); 
  const [showPassword, setShowPassword] = useState(false)
  const [debugInfo, setDebugInfo] = useState("");

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

  return (
    <div className="loginSection">
      {loading && (
        <div className="loaderSection">
          <ThreeCircles
            visible={loading}
            height={100}
            width={100}
            color="#4fa94d"
            ariaLabel="three-circles-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
          <p>Login in process... Please wait</p>
          <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666'}}>
            {debugInfo.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        </div>
      )}
      {!loading && (
        <form className='authForm' onSubmit={loginHandler} autoComplete='off'>
          <h3>Vendor Login</h3>
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
        </form>
      )}
    </div>
  )
}

export default Login