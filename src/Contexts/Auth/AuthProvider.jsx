import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { apiServices } from "../../services/apiServices";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiServices.getProfile();
        setUser(data.user);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  //ok

  const login = async (credentials) => {
    try {
      // Em produção, fazer chamada para /api/auth/login
      const { data } = await apiServices.login(credentials);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, error: error.response.data.error };
    }
  };
  //ok
  const getUsers = async () => {
    try {
      const { data } = await apiServices.getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return {
        success: false,
        error: error.response.data.error || "Erro na busca dos usuários.",
      };
    }
  };
  //ok
  const register = async (userData) => {
    try {
      const { data } = await apiServices.register(userData);
      return { success: true, message: data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao criar conta",
      };
    }
  };

  const deleteUser = async (id) => {
    try {
      await apiServices.deleteUser(id);

      setUsers((prev) => prev.filter((user) => user._id !== id));

      return { success: true };
    } catch (error) {
      console.error(error);
      return {
        success: false,
        error: error.response?.data?.error || "Erro ao deletar usuário",
      };
    }
  };

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);

      const response = await apiServices.updateUser(id, userData);
      const updatedUser = response.data.user;
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : user)),
      );

      return { success: true, user: updatedUser };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.response.data.error };
    } finally {
      setLoading(false);
    }
  };

  //ok
  const logout = async () => {
    localStorage.removeItem("token");
    alert("Logout realizado com sucesso!");
    setUser(null);
  };
  //ok
  const isAdmin = () => user?.role === "admin";

  const updateProfile = async (profileData) => {
    try {
      const { data } = await apiServices.updateProfile(profileData);

      setUser(data.user);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error,
      };
    }
  };

  const updateAffiliate = async (userId, data) => {
    try {
      const res = await apiServices.updateAffiliate(userId, data);

      // atualiza usuário na lista
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, affiliate: res.data.affiliate } : u,
        ),
      );

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error,
      };
    }
  };

  const payAffiliate = async (userId) => {
    try {
      const res = await apiServices.payAffiliate(userId);

      // recarrega usuários pra atualizar saldo
      await getUsers();

      return { success: true, paid: res.data.paid };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error,
      };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAdmin,
        updateUser,
        loading,
        users,
        getUsers,
        deleteUser,
        editingUser,
        setEditingUser,
        updateProfile,
        updateAffiliate,
        payAffiliate,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
