import React from "react";
import { Main } from "./pages/Main/Main";
import { UserProvider } from "./components/UserProvider";

function App() {
  return (
    <UserProvider>
      <Main />
    </UserProvider>
  );
}

export default App;
