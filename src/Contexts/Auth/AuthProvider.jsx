import { useState } from "react";
import { AuthContext } from "./AuthContext";
import { useEffect } from "react";
import { cookieUtils } from "../../Utils/cookieUtils";
import { apiServices } from "../../services/apiServices";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await apiServices.getProfile();
        setUser(data.user);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        cookieUtils.remove("token");
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

  const updateUser = async (id, userData) => {
    try {
      setLoading(true);

      const response = await apiServices.updateUser(id, userData);
      const updatedUser = response.data.user;
      setUsers((prev) =>
        prev.map((user) => (user._id === id ? updatedUser : userData)),
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
    try {
      const { data } = await apiServices.logout();
      alert(data.message);
      setUser(null);
    } catch (error) {
      console.error("Erro no logout:", error);
      setUser(null);
    }
  };
  //ok
  const isAdmin = () => user?.role === "admin";

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
