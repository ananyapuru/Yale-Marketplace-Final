import React, { useState } from "react";
import { addObject } from "../services/object.service"
import HeaderComponent from '../components/navbar/NavbarComponent';
import { getUserId } from "../services/auth.service";
import {
    Checkbox,
    Typography,
    FormControlLabel
} from '@mui/material';
import './AddObject.css';


import Footer from '../components/footer/Footer'

const AddObject = () => {
    const [objectTitle, setObjectTitle] = useState("");
    const [objectTags, setObjectTags] = useState();
    const [objectPrice, setObjectPrice] = useState();
    const [objectDescription, setObjectDescription] = useState("");
    const [objectContact, setObjectContact] = useState("");
    // const [objectImage, setObjectImage] = useState("")
    const [files, setFiles] = useState([]);
    const [objectCategory, setObjectCategory] = useState([false, false, false])
    const handleSubmit = (e) => {
        e.preventDefault()
        const objectData = {
            "object_title": objectTitle,
            "object_price": objectPrice,
            "object_description": objectDescription,
            "object_image": files,
            "object_tags": objectTags,
            "object_category": objectCategory,
            "contact": objectContact,
            "user_id": getUserId(),
        }
        addObject(objectData)
        console.log(objectData)
        alert("Object created!")

    }
    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files)
        const encoded_files = []
        for (let i=0; i<=files.length - 1; i++){
            const encoded_file = await convertBase64(files[i]);
            encoded_files.push(encoded_file)
        }
        setFiles(encoded_files)
    }
    // const handleFileChange = async (e) => {
    //     const file = e.target.files[0]
    //     const img = await convertBase64(file)
    //     console.log(img)
    //     setObjectImage(img)
    // }
    const convertBase64= (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = (() => {
                resolve(fileReader.result);
            });
            fileReader.onerror = ((error) => {
                reject(error);
            });
        })

    } 
       
    const handleChange1 = (event) => {
        setObjectCategory([!objectCategory[0], objectCategory[1], objectCategory[2]]);
    };
    const handleChange2 = (event) => {
        setObjectCategory([objectCategory[0], !objectCategory[1], objectCategory[2]]);
    };
    const handleChange3 = (event) => {
        setObjectCategory([objectCategory[0], objectCategory[1], !objectCategory[2]]);
    };
    console.log(files)

    return(
        <>
            <HeaderComponent />
            <div className="MainDiv" style={{minHeight:'100vh'}}>
                <div className="container main-container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="text-center mt-5 mb-5" style={{ height: '0.5%', fontSize: '30px' }}>Add Object</h1>
                            <form  className="mt-5 mb-5">
                                <div className="form-group">
                                    <input type="text" onChange={ (e) => setObjectTitle(e.target.value) }  style={{ marginBottom: "1rem"}} className="form-control" id="objecttitle" placeholder="Enter Object Title" />  
                                </div>
                                <div className="form-group">
                                    <input type="number" onChange={ (e) => setObjectPrice(e.target.value) } style={{ marginBottom: "1rem"}} className="form-control" id="price" placeholder="Object Price in Dollars" />
                                </div>
                                <div className="form-group">
                                <Typography>Category:</Typography>
                                    <FormControlLabel
                                        control={
                                        <Checkbox checked={objectCategory[0]} onChange={handleChange1} name="Item" />
                                        }
                                        label="Item"
                                    
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox checked={objectCategory[1]} onChange={handleChange2} name="Renting" />
                                        }
                                        label="Renting"
                                    
                                    />
                                    <FormControlLabel
                                        control={
                                        <Checkbox checked={objectCategory[2]} onChange={handleChange3} name="Service" />
                                        }
                                        label="Service"
                                    
                                    />
                                </div>
                               
                                <div className="form-group">
                                    <input type="text" onChange={ (e) => setObjectTags(e.target.value) }  style={{ marginBottom: "1rem"}} className="form-control" id="objecttags" placeholder="Enter Object Tags" />  
                                </div>
                                <div className="form-group">
                                    <label  for="image">Object Image:</label>
                                    <input style={{ marginBottom: "1rem"}} onChange={handleFileChange} type="file" className="form-control" id="image" multiple/>
                                </div>
                                <div style={{ marginBottom: "1rem"}} className="form-group">
                                    <label for="comment">Object Description:</label>
                                    <textarea onChange={ (e) => setObjectDescription(e.target.value) } className="form-control" rows="5" id="objectdesc"></textarea>
                                </div>
                                <div style={{ marginBottom: "1rem"}} className="form-group">
                                    <label for="comment">Contact:</label>
                                    <textarea onChange={ (e) => setObjectContact(e.target.value) } className="form-control" rows="5" id="objectdesc"></textarea>
                                </div>
                                <button type="submit" className="btn btn-primary" onClick={(e) => handleSubmit(e)}>Submit</button>
                            </form>
                        </div>
                    
                    </div>
                </div>     
            </div>
            <Footer/>
        </>

    );
}
export default AddObject;


