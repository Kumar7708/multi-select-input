import "./App.css";
import { useEffect, useRef, useState } from "react";
import Pill from "./components/Pill";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersSet, setSelectedUsersSet] = useState(new Set());

  const inputRef = useRef(null);

  useEffect(() => {
    const fetchUsers = () => {
      if (searchTerm.trim() === "") {
        setSuggestions([]);
        return;
      }
      fetch(`https://dummyjson.com/users/search?q=${searchTerm.trim()}`)
        .then((res) => res.json())
        .then((res) => setSuggestions(res));
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSelectUser = (user) => {
    setSelectedUsers([...selectedUsers, user]);
    setSelectedUsersSet(new Set([...selectedUsersSet, user.email]));
    setSearchTerm("");
    setSuggestions([]);
    inputRef.current.focus();
  };

  const handleRemoveUser = (user) => {
    const newSelectedUsers = selectedUsers.filter(
      (sUser) => sUser.id !== user.id
    );
    setSelectedUsers(newSelectedUsers);
    const newSelectedSet = new Set(selectedUsersSet);
    newSelectedSet.delete(user.email);
    setSelectedUsersSet(newSelectedSet);
    inputRef.current.focus();
  };

  const handleKeyDown = (e) => {
    const len = selectedUsers.length;
    if(len > 0 && searchTerm === "" && e.key === "Backspace") {
      handleRemoveUser(selectedUsers[len-1]);
    }
  };

  return (
    <div className="user-search-container">
      <div className="user-search-input">
        {selectedUsers?.map((user) => {
          return (
            <Pill
              key={user.email}
              image={user.image}
              text={`${user.firstName} ${user.lastName}`}
              onClick={() => handleRemoveUser(user)}
            />
          );
        })}
        <div>
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e)}
            placeholder="Search for a User..."
          />
          <ul className="suggestions-list">
            {suggestions?.users?.map((user) => {
              return !selectedUsersSet.has(user.email) ? (
                <li
                  key={user.email}
                  onClick={() => handleSelectUser(user)}
                  
                >
                  <img
                    src={user.image}
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <span>{`${user.firstName} ${user.lastName}`}</span>
                </li>
              ) : (
                <></>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
