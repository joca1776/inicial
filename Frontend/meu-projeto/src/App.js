// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

//------------------- acima, arquivo padrao criado pelo react. Abaixo react ligado ao python no backend:

// import { useEffect, useState } from "react";

// function App() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch("http://127.0.0.1:5000/users")
//       .then(response => response.json())
//       .then(data => setUsers(data))
//       .catch(error => console.error("Erro ao buscar usuários:", error));
//   }, []);

//   return (
//     <div>
//       <h1>Lista de Usuários</h1>
//       <ul>
//         {users.map(user => (
//           <li key={user.id}>{user.name}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default App;



// -----------------------------ABAIXO, CÓDIGO COM 4 BOTÕES DE CRUD

import React, { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ id: "", name: "" });
  const [selectedUserId, setSelectedUserId] = useState("");
  const [updatedUser, setUpdatedUser] = useState({ name: "" });
  const [readUser, setReadUser] = useState(null);
  const [createSuccess, setCreateSuccess] = useState(false);
  const [readSuccess, setReadSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.error("Erro ao buscar usuários:", error));
  }, []);

  const handleCreate = () => {
    fetch("http://127.0.0.1:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: Number(newUser.id), name: newUser.name }),
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers([...users, data]);
        setCreateSuccess(true);
      })
      .catch((error) => console.error("Erro ao criar usuário:", error));
  };

  const handleRead = () => {
    fetch(`http://127.0.0.1:8000/users/${selectedUserId}`)
      .then((response) => response.json())
      .then((data) => {
        setReadUser(data);
        setReadSuccess(true);
      })
      .catch((error) => console.error("Erro ao ler usuário:", error));
  };

  const handleUpdate = () => {
    if (!selectedUserId || !updatedUser.name) {
      console.error("ID do usuário ou novo nome está vazio!");
      return;
    }

    const body = JSON.stringify({
      id: Number(selectedUserId),
      name: updatedUser.name,
    });

    fetch(`http://127.0.0.1:8000/users/${selectedUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers(
          users.map((user) =>
            user.id === Number(selectedUserId) ? data : user
          )
        );
        setUpdateSuccess(true);
      })
      .catch((error) => console.error("Erro ao atualizar usuário:", error));
  };

  const handleDelete = () => {
    fetch(`http://127.0.0.1:8000/users/${selectedUserId}`, {
      method: "DELETE",
    })
      .then(() => {
        setUsers(users.filter((user) => user.id !== Number(selectedUserId)));
        setDeleteSuccess(true);
      })
      .catch((error) => console.error("Erro ao deletar usuário:", error));
  };

  return (
    <div>
      <h1>Lista de Usuários</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <div>
        <h2>Criar Usuário</h2>
        <input
          type="number"
          placeholder="ID"
          value={newUser.id}
          onChange={(e) => setNewUser({ ...newUser, id: e.target.value })}
        />
        <input
          type="text"
          placeholder="Nome"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
        />
        <button onClick={handleCreate}>Criar</button>
        {createSuccess && <p>Usuário Criado com Sucesso!</p>}
      </div>

      <div>
        <h2>Ler Usuário</h2>
        <input
          type="number"
          placeholder="ID do Usuário"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        />
        <button onClick={handleRead}>Ler</button>
        {readSuccess && readUser && (
          <p>
            Usuário: {readUser.name}, ID: {readUser.id}
          </p>
        )}
      </div>

      <div>
        <h2>Atualizar Usuário</h2>
        <input
          type="number"
          placeholder="ID do Usuário"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Novo Nome"
          value={updatedUser.name}
          onChange={(e) => setUpdatedUser({ name: e.target.value })}
        />
        <button onClick={handleUpdate}>Atualizar</button>
        {updateSuccess && <p>Usuário Atualizado com Sucesso!</p>}
      </div>

      <div>
        <h2>Deletar Usuário</h2>
        <input
          type="number"
          placeholder="ID do Usuário"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        />
        <button onClick={handleDelete}>Deletar</button>
        {deleteSuccess && <p>Usuário deletado com sucesso!</p>}
      </div>
    </div>
  );
}

export default App;



