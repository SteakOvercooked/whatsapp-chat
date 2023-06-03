import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './routes/Login';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat'>
          <Route index element={<div>Enter phone number of a receiver</div>} />
          <Route path='create' element={<div>Enter phone number of a receiver</div>} />
          <Route path=':chatId' element={<div>Connected to chat!</div>} />
        </Route>
      </Routes>
    </Router>
  );
};
