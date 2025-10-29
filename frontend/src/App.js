import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const resultRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageUrl(URL.createObjectURL(file));
            setPrediction(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert("Please select a file first!");
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            // THIS IS THE CORRECTED AND FINAL URL
            const response = await axios.post("https://crop-vision-project.onrender.com/predict", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setPrediction(response.data);
        } catch (error) {
            console.error("Error uploading the file:", error);
            alert("There was an error making the prediction.");
        }
    };

    useEffect(() => {
        if (prediction && resultRef.current) {
            resultRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [prediction]);

    return (
        <div className="App">
            <div className="container">
                <h1>🌿 Crop Vision AI 🌿</h1>
                <p>Upload an image of a potato leaf to classify its disease.</p>
                <input type="file" onChange={handleFileChange} accept="image/*" />
                {imageUrl && (
                    <div>
                        <h2>Selected Image:</h2>
                        <img src={imageUrl} alt="Selected Upload" />
                    </div>
                )}
                <button onClick={handleUpload} disabled={!selectedFile}>Predict</button>
                {prediction && (
                    <div ref={resultRef}>
                        <h2>Prediction Result:</h2>
                        <h3>Class: {prediction.class}</h3>
                        <h3>Confidence: { (prediction.confidence * 100).toFixed(2) }%</h3>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;