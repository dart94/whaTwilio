// src/pages/Login.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import icon from '../img/logo2.png';
import { login } from '../services/auth';
import styles from '../styles/Login.module.css';
import { toast } from 'react-toastify';
import { IoMdLogIn } from "react-icons/io";


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
  
    try {
      const userData = await login(email, password);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/mesaje');
    } catch (error: any) {
      toast.error('Error al iniciar sesión. Verifica tus credenciales.');
      console.error('Error al conectar con el servidor:', error);
      setErrorMessage(error.message || 'Error al iniciar sesión.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <img src={icon} alt="Your Logo" className={styles.logo} />
      </div>

      <div className={styles.rightSide}>
        <h1 className={styles.title}>Iniciar sesión</h1>
        <p className={styles.subtitle}>
          Inicia sesión para acceder a tu cuenta
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Correo</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@gruponissauto.com.mx"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup} style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="password" className={styles.label}>Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="****************"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className={styles.error}>{errorMessage}</div>
          )}

          <button type="submit" className={styles.button}>
            
            Iniciar sesión
            <IoMdLogIn size={20} style={{ marginLeft: "8px", alignItems: "center" }} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
