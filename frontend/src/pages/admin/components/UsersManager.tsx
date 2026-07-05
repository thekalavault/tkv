import React, { useEffect, useState } from 'react';

interface Role {
  name: string;
}

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  role: Role;
}

export default function UsersManager() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('kalavault_token');
      const res = await fetch('http://localhost:3000/api/v1/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      const token = localStorage.getItem('kalavault_token');
      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}/role`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to update role. Ensure you have admin privileges.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`WARNING: Are you sure you want to completely remove the user ${email} from the system? This action cannot be undone.`)) return;
    
    try {
      const token = localStorage.getItem('kalavault_token');
      const res = await fetch(`http://localhost:3000/api/v1/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchUsers();
      } else {
        alert("Failed to delete user.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-8 border border-outline/10 shadow-sm">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="font-display-md text-2xl text-primary mb-2">User Registry</h3>
          <p className="font-body-md text-on-surface-variant text-sm">
            Manage system access, assign roles, and remove inactive accounts.
          </p>
        </div>
        <button onClick={fetchUsers} className="font-label-caps text-[11px] bg-subtle-smoke px-6 py-2 uppercase tracking-widest hover:bg-gallery-gold/10 transition-colors">
          Refresh List
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center animate-pulse text-primary/50 font-label-caps text-[11px] uppercase tracking-widest">
          Loading Registry Data...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline/10 text-primary/60 font-label-caps text-[10px] uppercase tracking-widest">
                <th className="pb-4 font-normal">Account Holder</th>
                <th className="pb-4 font-normal">Contact Identity</th>
                <th className="pb-4 font-normal">System Status</th>
                <th className="pb-4 font-normal">Clearance Level (Role)</th>
                <th className="pb-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-sm">
              {users.map((user) => (
                <tr key={user.id} className="border-b border-outline/5 hover:bg-subtle-smoke/30 transition-colors">
                  <td className="py-4 text-primary font-medium">{user.firstName} {user.lastName}</td>
                  <td className="py-4 text-on-surface-variant">{user.email}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-sm text-[10px] font-label-caps uppercase tracking-wider ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-4">
                    <select 
                      value={user.role.name}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="bg-paper-white border border-outline/20 text-[12px] font-body-md px-3 py-1.5 focus:outline-none focus:border-gallery-gold"
                    >
                      <option value="customer">Customer</option>
                      <option value="operations">Operations</option>
                      <option value="account_manager">Sales / Account Manager</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user.id, user.email)}
                      className="text-red-500/70 hover:text-red-600 transition-colors"
                      title="Remove User"
                    >
                      <span className="material-symbols-outlined text-[18px]">person_remove</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
