import React, { useEffect } from "react";
import { useAuth } from "../../Contexts/Auth/AuthContext";
import { NavLink, Outlet } from "react-router-dom";
import UserForm from "../UserForm/UserForm";

const UserManage = () => {
  const { users, setEditingUser, getUsers, deleteUser } = useAuth();

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-[#5B2333]">
          Gerenciar Usuários
        </h2>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[#E8D8C3]">
        <table className="w-full bg-white">
          <thead className="bg-[#F1E8E2] text-[#5B2333] text-sm uppercase tracking-wide">
            <tr>
              <th className="px-6 py-4 text-left">Usuário</th>
              <th className="px-6 py-4 text-left">Email</th>
              <th className="px-6 py-4 text-left">Função</th>
              <th className="px-6 py-4 text-left">Data Cadastro</th>
              <th className="px-6 py-4 text-left">Ações</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8D8C3]">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-[#F8F5F2] transition-all">
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.role}</td>
                <td className="px-6 py-4">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </td>
                <td className="px-6 py-4 space-x-4">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="text-[#5B2333] hover:text-[#C6A75E]"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      const confirmDelete = window.confirm(
                        "Tem certeza que deseja deletar este usuário?",
                      );

                      if (!confirmDelete) return;

                      const result = await deleteUser(user._id);

                      if (!result.success) {
                        alert(result.error);
                      }
                    }}
                    className="text-red-600 hover:text-red-800"
                  >
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <UserForm />
      <Outlet />
    </div>
  );
};

export default UserManage;
