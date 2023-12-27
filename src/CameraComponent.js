import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';

const CameraComponent = () => {
    const socket = useRef(null);
    const webcamRef = useRef(null);
    const [maxKey, setMaxKey] = useState(null);
    const [maxValue, setMaxValue] = useState(null);

    useEffect(() => {
        // Connect to your Python server via WebSocket
        socket.current = io('http://43.239.223.19:1005');

        // Start sending frames from the camera to the server
        const captureAndSendFrame = () => {
            const frame = webcamRef.current.getScreenshot();
            // Send the frame to the server via WebSocket
            socket.current.emit('image', frame);
        };

        // Set the interval for sending frames (adjust as needed)
        const intervalId = setInterval(captureAndSendFrame, 200);

        // Listen for response from the server
        socket.current.on('response', (data) => {
            // Update state with the received data
            setMaxKey(data.max_key);
            setMaxValue(data.max_value);
        });

        // Clean up the interval and disconnect the WebSocket when the component unmounts
        return () => {
            clearInterval(intervalId);
            socket.current.disconnect();
        };
    }, []);

    return (
        <div>
            <div>New Romantics</div>
            <Webcam ref={webcamRef} />

            {/* Display the received data */}
            {maxKey && (
                <div>
                    <p>Max Key: {maxKey}</p>
                    <p>Max Value: {maxValue}</p>
                </div>
            )}
        </div>
    );
};

export default CameraComponent;
