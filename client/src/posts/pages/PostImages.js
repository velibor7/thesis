// import {storage} from "../../shared/util/storage-key"
import React, { useState} from "react";
import { useParams } from 'react-router-dom' 
// import { getDownloadURL, listAll, ref } from "firebase/storage";
import "../components/Image.css"

import Button from "../../shared/components/FormElements/Button";

const PostImages = () => {
    const { id } = useParams();
    const [loadedImages, setLoadedImages] = useState([]);
    // const imageListRef = ref(storage, `/${id}`)

    const loadImage = () => {
        // listAll(imageListRef).then((response) => {
        //     response.items.forEach((item) => {
        //         getDownloadURL(item).then((url) => {
        //             setLoadedImages((prev) => [...prev, url])
        //         });
        //     });
        // });
    };

    return (
        <>
            <div className="image__container">
                <div className="image__items">
                    <Button  onClick={loadImage} >Show Images</Button>
                    <Button  to={`new`} >Upload Images</Button>
                </div>
                <div>
                    {loadedImages.map((url) => {    
                        return <img src={url} alt="Slika nije ucitana" key={url}/>;
                    })}
                </div>
            </div>
        </>
    );

}

export default PostImages