import './App.css';
import { useState,useEffect } from 'react';

function App() {
  const [formData,setFormData]=useState({firstname:'',lastname:'',city:''});
  const [isEditing,setIsEditing]=useState(false);
  const [records,setRecords]=useState([]);
  const [editingId,setEditingId]=useState(null);

  useEffect(()=>{
    fetchData();
  },[])

  

  const handleSubmit=(e)=>{
    e.preventDefault();
    //updating the record
    if(isEditing){
      fetch(`https://db-infocapture-46e41-default-rtdb.asia-southeast1.firebasedatabase.app/user/${editingId}.json`,{
      method:'PUT',
      header:{'Content-Type':'application/json'},
      body:JSON.stringify(formData)}
    ).then(()=>{ 
      
      setEditingId(null)
      setIsEditing(false)
      setFormData({firstname:'',lastname:'',city:''});
      fetchData();
    })
    }else{
      
      fetch('https://db-infocapture-46e41-default-rtdb.asia-southeast1.firebasedatabase.app/user.json',{
        method:'POST',
        header:{'Content-Type':'application/json'},
        body:JSON.stringify(formData)
      })
      fetchData();
      setEditingId(null)
    }
  }

  const fetchData=()=>{
    fetch('https://db-infocapture-46e41-default-rtdb.asia-southeast1.firebasedatabase.app/user.json').then(response=>response.json()).then(data=>{
      const loadedRecords=[];
      for(const key in data){
        loadedRecords.push(
          {
          id:key,...data[key]
          }
        )
      }
      setRecords(loadedRecords);
    })
  }
  
  const handleEdit=(record)=>{
    setIsEditing(true);
    setEditingId(record.id);
    setFormData({firstname:record.firstname,lastname:record.lastname,city:record.city});
    
  };
  const handleDelete=(id)=>{
    fetch(`https://db-infocapture-46e41-default-rtdb.asia-southeast1.firebasedatabase.app/user/${id}.json`,{
      method:'DELETE'
    }
    )
  };
  const handleInputChange=(e)=>{
    const {name,value}=e.target;
    setFormData(prevFormData=>({...prevFormData,[name]:value})) ;
  };

  return (
    <>
      <div className='App'>
        <div className='form-container'>
          <div>
            <h2>InfoCapture</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <input 
            type="text" 
            name='firstname' 
            placeholder='Firstname' 
            value={formData.firstname}
            onChange={handleInputChange}
            required/>
            <input
             type="text" 
            name='lastname' 
            placeholder='lastname'value={formData.lastname}
            onChange={handleInputChange} 
            required/>
            <input
             type="text" 
            name='city' 
            placeholder='city' 
            value={formData.city}
            onChange={handleInputChange}
            required/>
            {
               isEditing ? (<button className='updateBtn' type="submit">Update Record</button>) : (<button
                className='addBtn'type="submit">Add Record</button>)
            }
            
            
          </form>
        </div>
        <div className='table-container'>
            <h2>DigiPunk World Citizens</h2>
            <h4 className='notification'>A new record was added</h4>
            <table>
              <thead>
                <tr>
                  <th>Firstname</th>
                  <th>Lastname</th>
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map(record=>(
                  <tr key={record.id}>
                    <td>{record.firstname}</td>
                    <td>{record.lastname}</td>
                    <td>{record.city}</td>
                    <td>
                  
                      <i className="fa-solid fa-pen-to-square editBtn myBtn" onClick={()=>handleEdit(record)}></i>
                      <i className="fa-solid fa-rectangle-xmark delBtn myBtn" onClick={()=>handleDelete(record.id)}></i>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
        <div className='footer'>
        ©{new Date().getFullYear()}InfoCapture.All rights reserved.
        </div>
      </div>
    </>
  )
};

export default App;
