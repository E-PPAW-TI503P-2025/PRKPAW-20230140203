import React, { useState } from 'react';
import './App.css';

function App() {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setGreeting(`Hello, ${name || 'Guest'}!`);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #B3C8CF, #E5E1DA)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div
        style={{
          backgroundColor: '#F1F0E8',
          borderRadius: '20px',
          padding: '40px 60px',
          boxShadow: '0 4px 15px rgba(137,168,178,0.3)',
          textAlign: 'center',
          width: '400px',
          transition: '0.3s ease',
        }}
      >
        <h1 style={{ color: '#89A8B2', marginBottom: '10px' }}>
          Praktikum 1 - React
        </h1>
        <p style={{ color: '#6c757d', marginBottom: '30px' }}>
          Masukkan nama kamu di bawah ini 👇
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Masukkan nama..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              padding: '10px 15px',
              borderRadius: '10px',
              border: '2px solid #B3C8CF',
              outline: 'none',
              width: '100%',
              fontSize: '16px',
              color: '#333',
              backgroundColor: '#fff',
              marginBottom: '20px',
              transition: '0.3s',
            }}
            onFocus={(e) => (e.target.style.borderColor = '#89A8B2')}
            onBlur={(e) => (e.target.style.borderColor = '#B3C8CF')}
          />
          <button
            type="submit"
            style={{
              backgroundColor: '#89A8B2',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              cursor: 'pointer',
              width: '100%',
              transition: '0.3s ease',
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = '#B3C8CF')}
            onMouseOut={(e) => (e.target.style.backgroundColor = '#89A8B2')}
          >
            Tampilkan
          </button>
        </form>

        {greeting && (
          <div
            style={{
              marginTop: '30px',
              padding: '15px',
              backgroundColor: '#E5E1DA',
              borderRadius: '10px',
              color: '#333',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.1)',
              fontSize: '20px',
              fontWeight: '500',
            }}
          >
            {greeting}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
