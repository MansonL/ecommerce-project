import React from 'react';
import { Main } from './pages/Main';
import { UserProvider } from './pages/components/UserProvider'

function App() {
  return (
    <UserProvider>
    <Main />
    </UserProvider>
  );
}

export default App;



