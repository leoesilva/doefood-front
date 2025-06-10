import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import { AuthProvider } from "./context/AuthContext"; // ajuste o caminho conforme necessário
import { ToastContainer } from "react-toastify";


function App() {
  return (
    <AuthProvider>
      <Router>
        <RoutesConfig />
      </Router>
      <ToastContainer />
    </AuthProvider>
    
  );
}

export default App;
