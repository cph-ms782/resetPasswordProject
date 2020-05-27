import React, { useState } from "react";


const AddUser = ({ initialUser, allowEdit }) => {
  const EMPTY_USER = { name: "", userName: "", role: "user", password: "" }
  console.log("initialUser", initialUser)
  let newUser = initialUser ? initialUser : { ...EMPTY_USER }
  console.log("newUser", newUser)

  const [user, setUser] = useState({ ...newUser })
  const [readOnly, setReadOnly] = useState(!allowEdit)

	const [ createUser, { data } ] = useMutation(ADD_USER, {
		update(cache, { data }) {
			const newUser = data.createUser;
			const p = cache.readQuery({ query: USERS });
			const { users } = p;
			users.push(newUser);
			cache.writeQuery({
				query: USERS,
				data: { users: [ ...users ] }
			});
		}
	});

  const handleChange = (event) => {
    const userName = event.target.id;
    console.log("userName: ", userName)
    user[userName] = event.target.value;
    console.log("user: ", { ...user })
    setUser({ ...user })
  }
  const handleSubmit = (event) => {
    event.preventDefault();

		createUser({
			variables: {
				input: {
          name: user.name,
          userName: user.userName,
          password: user.password
				}
			}
		});

    setUser({ ...EMPTY_USER })
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
      UserName <br/>
        <input readOnly={readOnly} type="text" id="userName" value={user.userName} onChange={handleChange} />
      </label>
      <br />
      <label>
        Name<br/>
        <input type="text" readOnly={readOnly} id="name" value={user.name} onChange={handleChange} />
      </label>
      <br />
      {readOnly && <p>Role: {user.role}</p>}
      <label hidden={readOnly}>
        Password <br/>
          <input readOnly={readOnly}  type="password" id="password" value={user.password} onChange={handleChange} />
      </label>
      <br /><br/>
      {!readOnly && <input type="submit" value="Submit" />}
    </form>
  );
}

export default AddUser;