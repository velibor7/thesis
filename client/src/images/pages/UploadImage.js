// import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
// import { storage } from '../../shared/util/storage-key';

import "../components/Image.css"


const UploadImage = () => {
    const { id } = useParams();
    const [progress, setProgress] = useState(0)
    const formHandler = (e) =>{
        e.preventDefault();
        const file = e.target[0].files[0];
        uploadFiles(file);
    }
    const uploadFiles = (file) => {
        
        // if(!file) return;
        // const storageRef = ref(storage, `/${id}/${file.name}`);
        // const uploadTask = uploadBytesResumable(storageRef, file);

        // uploadTask.on("state_changed", (snapshot) => {
        //     const prog = Math.round(
        //         (snapshot.bytesTransferred/snapshot.totalBytes) * 100
        //     );
        //     setProgress(prog);
        // }, (err) => console.log(err),
        // () => {
        //     getDownloadURL(uploadTask.snapshot.ref).then((url) => console.log(url));
        // }
        // )
    }

  return (
    <div className='uploadImage'>
        <form onSubmit={formHandler}>
            <input type="file" className='input'/>
            <button type='submit'>Upload</button>
        </form>
        <hr />
        <h3>Uploaded {progress} %</h3>
    </div>
  )
}

export default UploadImage;