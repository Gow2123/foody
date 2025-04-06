import React, {useState, useEffect} from 'react'
import { API_URL } from '../../data/apiPath';
import { ThreeCircles } from 'react-loader-spinner';


const AddProduct = () => {
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState([]);
    const [bestSeller, setBestSeller] = useState(false);
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasFirm, setHasFirm] = useState(true);

    useEffect(() => {
        // Check if firmId exists when component mounts
        const firmId = localStorage.getItem('firmId');
        if (!firmId) {
            setHasFirm(false);
        }
    }, []);

    const handleCategoryChange = (event)=>{
      const value = event.target.value;
        if(category.includes(value)){
          setCategory(category.filter((item)=> item !== value));
        }else{
          setCategory([...category, value])
        }
    }

    const handleBestSeller =(event)=>{
      const value = event.target.value === 'true'
      setBestSeller(value)
    }
    
    const handleImageUpload =(event)=>{
      const selectedImage = event.target.files[0];
      setImage(selectedImage)
    }

    const handleAddProduct = async(e)=>{
        e.preventDefault()
        setLoading(true);

        try {
            const loginToken = localStorage.getItem('loginToken');
            const firmId = localStorage.getItem('firmId')

            if(!loginToken || !firmId){
                console.error("User not authenticated or no firm selected");
                alert("Please add a firm before adding products");
                setLoading(false);
                return;
            }
            
            const formData = new FormData();
            formData.append('productName', productName);
            formData.append('price', price);
            formData.append('description', description);
            formData.append('bestSeller', bestSeller)
            formData.append('image', image)

            category.forEach((value)=>{
              formData.append('category', value)
            });
    
            const response = await fetch(`${API_URL}/product/add-product/${firmId}`, {
                method:'POST',
                body: formData
            })
            const data = await response.json()

            if(response.ok){
                alert('Product added successfully')
                // Reset the form
                setProductName("")
                setPrice("");
                setCategory([])
                setBestSeller(false);
                setImage(null);
                setDescription("")
            } else {
                alert('Failed to add Product: ' + (data.error || 'Unknown error'))
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Failed to add Product')
        } finally {
            setLoading(false); 
        }
    }

    if (!hasFirm) {
        return (
            <div className="noFirmMessage">
                <h3>No Firm Found</h3>
                <p>You need to add a firm before you can add products.</p>
                <p>Please go to the <strong>Add Firm</strong> section in the sidebar menu to create your firm first.</p>
            </div>
        );
    }

    return (
        <div className="firmSection">
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
                    <p>Please wait, your product is being added...</p>
                </div>
            )}
            {!loading && (
                <form className="tableForm" onSubmit={handleAddProduct}>
                    <h3>Add Product</h3>
                    <label>Product Name</label>
                    <input 
                        type="text" 
                        value={productName} 
                        onChange={(e)=>setProductName(e.target.value)} 
                        required
                    />
                    <label>Price</label>
                    <input 
                        type="text" 
                        value={price} 
                        onChange={(e)=>setPrice(e.target.value)}
                        required
                    />
                    <div className="checkInp">
                        <label>Category</label>
                        <div className="inputsContainer">
                            <div className="checboxContainer">
                                <label>Veg</label>
                                <input type="checkbox" value="veg" checked={category.includes('veg')} onChange={handleCategoryChange} />
                            </div>
                            <div className="checboxContainer">
                                <label>Non-Veg</label>
                                <input type="checkbox" value="non-veg" checked={category.includes('non-veg')} onChange={handleCategoryChange} />
                            </div>
                        </div>
                    </div>
                    <div className="checkInp">
                        <label>Best Seller</label>
                        <div className="inputsContainer">
                            <div className="checboxContainer">
                                <label>Yes</label>
                                <input type="radio" value="true" checked={bestSeller === true} onChange={handleBestSeller} />
                            </div>
                            <div className="checboxContainer">
                                <label>No</label>
                                <input type="radio" value="false" checked={bestSeller === false} onChange={handleBestSeller} />
                            </div>
                        </div>
                    </div>
                    <label>Description</label>
                    <input type="text" value={description} onChange={(e)=>setDescription(e.target.value)} />
                    <label>Firm Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    <br />
                    <div className="btnSubmit">
                        <button type='submit'>Submit</button>
                    </div>
                </form>
            )}
        </div>
    )
}

export default AddProduct