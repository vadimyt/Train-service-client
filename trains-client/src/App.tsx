import { BrowserRouter } from 'react-router-dom';
import RegistrationPage from './pages/registrationPage';
import AppRouter from './components/AppRouter';
import axios from 'axios';

function App() {
  //axios.defaults.withCredentials = true
  return (
    <div>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </div>
  )
}

export default App