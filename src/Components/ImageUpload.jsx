import { Button } from '@material-ui/core'
import React, { useState } from 'react'
import { storage,db } from '../firebase';
import firebase from 'firebase';
import './ImageUpload.css'


function ImageUpload({username}) {

    const [caption,setCaption] = useState('');
    const [image,setImage] = useState(null);
    const [progress,setProgress] = useState(0);

    const handelChange =(e)=>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    };

    const handelUpload =() =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function....
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) *100
                );
                setProgress(progress);
            },
            (error) => {
                console.log(error);
                alert(error.message);
            },
            //final upload complete function
            () =>{
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post inside database
                        db.collection("posts").add({
                            timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                            caption:caption,
                            photoUrl:url,
                            username:username
                        });
                        setProgress(0);
                        setCaption("");
                        setImage(null);
                    })
            }
        );
    };
    return (
        <div className="imageUpload">
            {/* input fields for post caption file picker post button */}
            <progress className="uploadProgressbar" value={progress} max="100" />
            <input type="text" className="caption_input" onChange={e => setCaption(e.target.value)} placeholder="Enter a caption"/>
            <input type="file" className="file_input" onChange={handelChange} />
            
            <Button className="uploadButton" onClick={handelUpload}>
                Upload
            </Button>
        </div>
    )
}

export default ImageUpload
 