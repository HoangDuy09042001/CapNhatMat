import React, {useState } from 'react';
import CameraComponent from './CameraComponent'
import IdInputForm from './IdInputForm'
const App = () => {
  const [showComponentB, setShowComponentB] = useState(false);
  const [company_id, setCompanyId] = useState('');
  const [client_id, setClientId] = useState('');

  const handleFormSubmit = ({ company_id, client_id }) => {
    // Xử lý logic của bạn ở đây, ví dụ: gửi request đến server, etc.
    console.log('Submitted:', { company_id, client_id });

    // Sau khi xử lý xong, set state để hiển thị Component B
    setShowComponentB(true);
    setCompanyId(company_id);
    setClientId(client_id);
  };

  return (
    <div>
      <h1>Cập nhật khuôn mặt</h1>
      {!showComponentB ? (
        <IdInputForm onSubmit={handleFormSubmit} />
      ) : (
        <CameraComponent company_id={company_id} client_id={client_id} />
      )}
    </div>
  );
};

export default App;
