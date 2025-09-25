import React, { useEffect, useState } from 'react';
import './Admin.css';
import { SequencePuzzle } from '../../types';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Admin: React.FC = () => {
  const [sequences, setSequences] = useState<SequencePuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSequences();
  }, []);

  const fetchSequences = async () => {
    setLoading(true);
    // Placeholder: would call /api/admin/sequences
    setTimeout(() => {
      setSequences([]);
      setLoading(false);
    }, 500);
  };

  return (
    <div className="admin-panel">
      <h1>Admin Panel</h1>
      <p>Sequence management coming soon.</p>
      {loading ? <div>Loading...</div> : (
        <table className="sequence-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numbers</th>
              <th>Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {sequences.map(seq => (
              <tr key={seq.id}>
                <td>{seq.id}</td>
                <td>{seq.numbers.join(', ')}</td>
                <td>{seq.difficulty}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Admin;
