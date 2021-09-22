import axios from 'axios';

import { LogTable } from './components/LogTable';
import './App.css';

const user = {
  id: 1,
  name: 'zougui',
  email: 'zougui@gmail.com',
  password: 'mypass',
};

const fetchUsers = async (token: string) => {
  const authTest = await axios.get(`http://localhost:3103/api/v1/users?page=0&pageSize=10`, { headers: { Authorization: `Bearer ${token}` } });
  console.log('authTest', authTest.data);
}

// @ts-ignore
const signup = async () => {
  await axios.post('http://localhost:3103/auth/signup', { ...user, id: undefined });
}

const login = async () => {
  const { data } = await axios.post('http://localhost:3103/auth/login', {
    name: user.name,
    email: user.email,
    password: user.password,
  });
  console.log('token', data.accessToken);
  return data.accessToken;
}

(async () => {
  try {
    await signup();
    const token = await login();
    await fetchUsers(token);
    const signed = await axios.get('http://localhost:3103/auth/sign-url', {
      params: {
        url: 'http://localhost:3104/api/v1/files/users/0/dragon_0.png',
        expiry: '15 min',
        something: ['first', 'second']
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('signed', signed.data)
  } catch (error: any) {
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
