import React,{useState, useEffect} from 'react'
import { API_URL } from '../data/apiPath';

const AllProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasFirm, setHasFirm] = useState(true);
    const [debugInfo, setDebugInfo] = useState("");

    const productsHandler = async() => {
        setLoading(true);
        const firmId = localStorage.getItem('firmId');
        const token = localStorage.getItem('loginToken');
        
        setDebugInfo(`API URL: ${API_URL}\nFirmId: ${firmId || 'Not found'}\nToken: ${token ? 'Present' : 'Missing'}`);
        
        if (!firmId) {
            console.error("firmId is missing in localStorage");
            setDebugInfo(prev => prev + "\nError: firmId is missing in localStorage");
            setHasFirm(false);
            setLoading(false);
            return;
        }
        
        try {
            console.log(`Fetching products from: ${API_URL}/product/${firmId}/products`);
            setDebugInfo(prev => prev + `\nFetching from: ${API_URL}/product/${firmId}/products`);
            
            const response = await fetch(`${API_URL}/product/${firmId}/products`);
            console.log("Products response status:", response.status);
            setDebugInfo(prev => prev + `\nResponse status: ${response.status}`);
            
            const newProductsData = await response.json();
            console.log("Products data:", newProductsData);
            setDebugInfo(prev => prev + `\nData: ${JSON.stringify(newProductsData).substring(0, 100)}...`);
            
            if (response.ok) {
                setProducts(newProductsData.products || []);
                setDebugInfo(prev => prev + `\nProducts found: ${newProductsData.products ? newProductsData.products.length : 0}`);
                setHasFirm(true);
            } else {
                setError(`Server error: ${newProductsData.error || 'Unknown error'}`);
                setDebugInfo(prev => prev + `\nServer error: ${newProductsData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error("failed to fetch products", error);
            setDebugInfo(prev => prev + `\nError: ${error.message}`);
            setError("Failed to fetch products. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        productsHandler();
        console.log('this is useEffect');
    }, []);

    const deleteProductById = async(productId) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const response = await fetch(`${API_URL}/product/${productId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    setProducts(products.filter(product => product._id !== productId));
                    alert("Product deleted successfully");
                }
            } catch (error) {
                console.error('Failed to delete product', error);
                alert('Failed to delete product');
            }
        }
    }

    if (!hasFirm) {
        return (
            <div className="noFirmMessage">
                <h3>No Firm Found</h3>
                <p>You need to add a firm before you can add or view products.</p>
                <p>Please go to the <strong>Add Firm</strong> section in the sidebar menu to create your firm first.</p>
                <div className="debugInfo" style={{fontSize: '12px', marginTop: '20px', color: '#666', textAlign: 'left'}}>
                    <h4>Debug Information:</h4>
                    {debugInfo.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="loading">
                <p>Loading products...</p>
                <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666', textAlign: 'left'}}>
                    <h4>Debug Information:</h4>
                    {debugInfo.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error">
                <p>{error}</p>
                <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666', textAlign: 'left'}}>
                    <h4>Debug Information:</h4>
                    {debugInfo.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                </div>
            </div>
        );
    }
    
    return (
        <div className='productSection'>
            {(!products || products.length === 0) ? (
                <div>
                    <p>No products added yet. Add your first product from the "Add Product" section.</p>
                    <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666', textAlign: 'left'}}>
                        <h4>Debug Information:</h4>
                        {debugInfo.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Image</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.productName}</td>
                                    <td>₹{item.price}</td>
                                    <td>
                                        {item.image && (
                                            <img 
                                                src={`${API_URL}/uploads/${item.image}`} 
                                                alt={item.productName}
                                                style={{ width: '50px', height:'50px' }}
                                            />
                                        )}
                                    </td>
                                    <td>
                                        <button 
                                            onClick={() => deleteProductById(item._id)}
                                            className='deleteBtn'
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="debugInfo" style={{fontSize: '12px', marginTop: '10px', color: '#666', textAlign: 'left'}}>
                        <h4>Debug Information:</h4>
                        {debugInfo.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllProducts