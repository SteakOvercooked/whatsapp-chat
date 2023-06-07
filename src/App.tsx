import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './routes/Login';
import { CreateChat } from './routes/ChatCreation';
import { Chat } from './routes/Chat';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/chat'>
          <Route index element={<CreateChat />} />
          <Route path='create' element={<CreateChat />} />
          <Route path=':id' element={<Chat />} />
        </Route>
      </Routes>
    </Router>
  );
};
