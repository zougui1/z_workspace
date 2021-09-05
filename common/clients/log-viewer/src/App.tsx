import axios from 'axios';

import { LogTable } from './components/LogTable';
import './App.css';

const user = {
  id: 1,
  name: 'zougui',
  email: 'zougui@gmail.com',
  password: 'mypass',
};

const fetchAuthTest = async (token: string) => {
  const authTest = await axios.get(`http://localhost:3103/auth/test/${user.id}`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('authTest', authTest.data);
}

const signup = async () => {
  await axios.post('http://localhost:3103/auth/signup', user);
}

const login = async () => {
  const { data } = await axios.post('http://localhost:3103/auth/login', user);
  console.log('token', data.token);
  return data.token;
}

(async () => {
  try {
    await signup();
    const token = await login();
    await fetchAuthTest(token);
    await new Promise(r => setTimeout(r, 5000));
    await fetchAuthTest(token);
    await new Promise(r => setTimeout(r, 5000));
    await fetchAuthTest(token);
  } catch (error) {
    console.error(error);
    console.log({...error})
  }
})()

function App() {
  return (
    <div className="App">
      <LogTable />
    </div>
  );
}

export default App;
