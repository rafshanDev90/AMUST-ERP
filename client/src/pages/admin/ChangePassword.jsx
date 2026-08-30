import React, { useState } from 'react';
import api from '../../api';

export default function AdminChangePassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await api.put('/auth/change-password', { oldPassword, newPassword });
    alert("Password changed successfully");
  };

  return (
    <div className="container">
      <h2>Change Password</h2>
      <form onSubmit={submit}>
        <input type="password" placeholder="Current Password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} />
        <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
        <button>Update</button>
      </form>
    </div>
  );
}
