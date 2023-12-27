import React, { useState } from 'react';
import './IdInputForm.scss'
const IdInputForm = ({ onSubmit }) => {
  const [company_id, setCompanyId] = useState('');
  const [client_id, setClientId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra xem cả hai trường đều đã được điền trước khi gọi hàm onSubmit
    if (company_id && client_id) {
      onSubmit({ company_id, client_id });
    } else {
      alert('Vui lòng nhập cả hai trường.');
    }
  };

  const handleKeyPress = (e) => {
    // Kiểm tra xem phím nhấn có phải là Enter không
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Company ID:
          <input
            type="text"
            value={company_id}
            onChange={(e) => setCompanyId(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </label>
        <br />
        <label>
          Client ID:
          <input
            type="text"
            value={client_id}
            onChange={(e) => setClientId(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <div className='poster'></div>
    </div>
  );
};

export default IdInputForm;
