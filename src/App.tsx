import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes/RoutesConfig";
import { AuthProvider } from "./context/AuthContext"; // ajuste o caminho conforme necessário

function App() {
  return (
    <AuthProvider>
      <Router>
        <RoutesConfig />
      </Router>
    </AuthProvider>
  );
}

export default App;
