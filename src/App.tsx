import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './routes/Login';
import { CreateChat } from './routes/ChatCreation';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat'>
          <Route index element={<CreateChat />} />
          <Route path='create' element={<CreateChat />} />
          <Route path=':chatId' element={<div>Connected to chat!</div>} />
        </Route>
      </Routes>
    </Router>
  );
};
