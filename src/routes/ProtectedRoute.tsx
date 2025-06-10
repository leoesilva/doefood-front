// src/routes/ProtectedRoute.tsx
import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebaseConfig";
import { onAuthStateChanged, getIdToken } from "firebase/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedTipo?: "doador" | "beneficiario"; // opcional
}

const ProtectedRoute = ({ children, allowedTipo }: ProtectedRouteProps) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return setIsAuth(false);

      const token = await getIdToken(user);
      localStorage.setItem("token", token);

      if (!allowedTipo) return setIsAuth(true);

      // Obtenha o tipo do Firestore se necessário
      const id = user.uid;
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setIsAuth(false);
          return;
        }

        const data = await res.json();
        console.log("Dados do usuário:", data);

        if (data?.tipo === allowedTipo) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch {
        setIsAuth(false);
      }
    });

    return () => unsubscribe();
  }, [allowedTipo]);

  if (isAuth === null) return null; // pode exibir um spinner aqui
  if (!isAuth) return <Navigate to="/autenticacao/login" />;
  return <>{children}</>;
};

export default ProtectedRoute;
