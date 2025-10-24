import React, { useState } from 'react';

const MoodleModal = ({ onClose, onImported }) => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    try {
      const res = await fetch('/api/moodle-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, username, password }),
      });
      const data = await res.json();
      console.log(data);
      onImported(); // para refrescar tareas en el calendario
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <h2>Importar tareas desde Moodle</h2>
      <input placeholder="URL Moodle" value={url} onChange={e => setUrl(e.target.value)} />
      <input placeholder="Usuario" value={username} onChange={e => setUsername(e.target.value)} />
      <input placeholder="Contraseña" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSubmit}>Importar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default MoodleModal;