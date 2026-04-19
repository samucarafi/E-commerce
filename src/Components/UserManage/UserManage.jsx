import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { Outlet } from "react-router-dom";
import UserForm from "../UserForm/UserForm";

const RoleBadge = ({ role }) => (
  <span
    className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase ${
      role === "admin"
        ? "bg-[#5B2333]/10 text-[#5B2333]"
        : "bg-gray-100 text-gray-500"
    }`}
  >
    {role === "admin" ? "Admin" : "Cliente"}
  </span>
);

const UserManage = () => {
  const { users, setEditingUser, getUsers, deleteUser } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Deletar "${user.name}"? Esta ação não pode ser desfeita.`,
      )
    )
      return;
    const result = await deleteUser(user._id);
    if (!result.success) alert(result.error);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-semibold text-[#1C1C1C]">Clientes</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {users.length} cadastrado{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EEE8E0] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#FAF7F4] border-b border-[#EEE8E0]">
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Usuário
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Email
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Função
                </th>
                <th className="px-5 py-3.5 text-left text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Desde
                </th>
                <th className="px-5 py-3.5 text-right text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F0EB]">
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-[#FAF7F4] transition-colors"
                >
                  {/* Name + avatar */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#5B2333]/10 flex items-center justify-center text-[#5B2333] text-xs font-semibold flex-shrink-0">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#1C1C1C]">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-500 text-xs">
                    {user.email}
                  </td>
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-5 py-4 text-gray-400 text-xs">
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-xs font-medium text-[#5B2333] hover:text-[#C6A75E] transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-xs font-medium text-gray-400 hover:text-red-500 transition-colors"
                      >
                        Deletar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-sm">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>
      </div>

      <UserForm />
      <Outlet />
    </div>
  );
};

export default UserManage;
