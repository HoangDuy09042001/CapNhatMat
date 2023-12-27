import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import io from 'socket.io-client';
import "./CameraComponent.scss"
import { PieChart } from 'react-minimal-pie-chart';
const CameraComponent = ({ company_id, client_id }) => {
    const socket = useRef(null);
    const webcamRef = useRef(null);
    const [maxKey, setMaxKey] = useState(null);
    const [maxValue, setMaxValue] = useState(null);
    const [avai_direct, setAvai_direct] = useState(null);
    const [status, setStatus] = useState(null);
    const clientId = client_id;
    const companyId = company_id;
    const [direction, setDirection] = useState('front')
    const GRAY = { value: 12.5, color: '#ccc' }
    const WHITE = { value: 12.5, color: '#fff' }
    const GREEN = { value: 12.5, color: '#00ff00' }
    const [data, setData] = useState([WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE, WHITE])
    const [success, setSuccess] = useState(false)

    const captureAndSendFrame = () => {
        const frame = webcamRef.current.getScreenshot();
        socket.current.emit('image', { frame, client_id: clientId, company_id: companyId, client_direct: direction });
    };
    const upDateCircle = (direct, status)=> {
        if (direct==='front' && status==='Exe')               return [WHITE, WHITE, WHITE, WHITE, WHITE, WHITE,  WHITE, WHITE]
        else if (direct==='front' && status==='Sufficent')    return [WHITE, WHITE, WHITE, WHITE, WHITE, GRAY,  WHITE, WHITE]
        else if (direct==='up' && status==='Exe')             return [WHITE, WHITE, WHITE, WHITE, WHITE, GRAY,  WHITE, WHITE]
        else if (direct==='up' && status==='Sufficent')       return [WHITE, WHITE, WHITE, WHITE, WHITE, GREEN, GRAY, WHITE]
        else if (direct==='upright' && status==='Exe')        return [WHITE, WHITE, WHITE, WHITE, WHITE, GREEN, GRAY,  WHITE]
        else if (direct==='upright' && status==='Sufficent')  return [WHITE, WHITE, WHITE, WHITE, WHITE, GREEN, GREEN, GRAY]
        else if (direct==='right' && status==='Exe')          return [WHITE, WHITE, WHITE, WHITE, WHITE, GREEN, GREEN, GRAY]
        else if (direct==='right' && status==='Sufficent')    return [GRAY,  WHITE, WHITE, WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='downright' && status==='Exe')      return [GRAY,  WHITE, WHITE, WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='downright' && status==='Sufficent')return [GREEN, GRAY,  WHITE, WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='down' && status==='Exe')           return [GREEN, GRAY,  WHITE, WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='down' && status==='Sufficent')     return [GREEN, GREEN, GRAY,  WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='downleft' && status==='Exe')       return [GREEN, GREEN, GRAY,  WHITE, WHITE, GREEN, GREEN, GREEN]
        else if (direct==='downleft' && status==='Sufficent') return [GREEN, GREEN, GREEN, GRAY,  WHITE, GREEN, GREEN, GREEN]
        else if (direct==='left' && status==='Exe')           return [GREEN, GREEN, GREEN, GRAY,  WHITE, GREEN, GREEN, GREEN]
        else if (direct==='left' && status==='Sufficent')     return [GREEN, GREEN, GREEN, GREEN, GRAY, GREEN, GREEN, GREEN]
        else if (direct==='upleft' && status==='Exe')         return [GREEN, GREEN, GREEN, GREEN, GRAY, GREEN, GREEN, GREEN]
        else if (direct==='upleft' && status==='Sufficent')   return [GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN, GREEN]

    }
    useEffect(() => {

        socket.current = io('http://43.239.223.137:3003', {
        });
        socket.current.emit('login', { client_id: clientId, company_id: companyId })
        socket.current.on('response', (data) => {
            setMaxKey(data.max_key);
            setMaxValue(data.max_value);
            setStatus(data.status)
            setData(upDateCircle(data.max_key, data.status))
            console.log(data.status)
            if (data.status.includes('Sufficent')) {
                setAvai_direct(data.avai_direct)
                if (data.max_key === 'front') {
                    setDirection('up')
                } else if (data.max_key === 'upright') {
                    setDirection('right')
                } else if (data.max_key === 'downright') {
                    setDirection('down')
                } else if (data.max_key === 'downleft') {
                    setDirection('left')
                } else if (data.max_key === 'down') {
                    setDirection('downleft')
                } else if (data.max_key === 'up') {
                    setDirection('upright')
                } else if (data.max_key === 'right') {
                    setDirection('downright')
                } else if (data.max_key === 'left') {
                    setDirection('upleft')
                } else if (data.max_key === 'upleft') {
                    setSuccess(true)
                }

            }
            if (data.status.includes('Enough')) {

                socket.current.emit('reset', { client_id: clientId, company_id: companyId })

                socket.current.emit('logout', { client_id: clientId, company_id: companyId })
                socket.current.disconnect();

                console.log('Disconnected from the server 1');
            }
        });

        // Listen for disconnect event
        socket.current.on('disconnect', () => {

            socket.current.disconnect();
            console.log('Disconnected from the server');
        });
        socket.current.on('error', () => {

            // socket.current.disconnect();
            console.log('Disconnected from the server');
        });

    }, []);

    useEffect(() => {
        console.log('Current: ', direction)
        const intervalId = setInterval(captureAndSendFrame, 500);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [captureAndSendFrame, direction]);



    return (
        <div className='main'>
            <div className='webcam-container'>
                <Webcam ref={webcamRef} videoConstraints={{
                    facingMode: 'user'
                }} height={600}  />
                {!success ?<PieChart
                    data={data}
                    lineWidth={20}
                    totalValue={100}
                    startAngle={22.5}
                    lengthAngle={360}
                    style={{ height: '450px', backgroundColor: 'pink', marginLeft: '10px'}}
                /> : <p style={{font: '30px', color: 'green', fontWeight: 'bold'}}>Cập nhật thành công với id nhân viên {clientId}, id công ty {companyId} </p>}
            </div>

            {maxKey && (
                <div>
                    <p>Điểm góc quay: {maxValue}</p>
                    <p>Các hướng đã quay được: {avai_direct}</p>
                    <p>Trạng thái: {maxKey} {status}</p>
                </div>
            )}
        </div>
    );
};


export default CameraComponent;
