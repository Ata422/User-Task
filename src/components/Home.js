import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";

export default function Home() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [user, setUser] = useState([]);
  const refForm = useRef();

  // Function for creating user
  const createUser = async (e) => {
    e.preventDefault();
    const form = refForm.current;
    const userName = form.name.value.trim();
    const userEmail = form.email.value.trim();
    const userRole = form.role.value.trim();
    let Error = false;
    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const roleError = document.getElementById("roleError");
    if (!userName) {
      nameError.innerText = "please enter name";
      Error = true;
    } else {
      nameError.innerText = "";
    }
    if (!userEmail) {
      emailError.innerText = "please enter email";
      Error = true;
    } else {
      emailError.innerText = "";
    }
    if (!userRole) {
      roleError.innerText = "please enter role";
      Error = true;
    } else {
      roleError.innerText = "";
    }
    if (Error) {
      return;
    }
    const { name, email, role } = credentials;
    const emailExist = user.some((checkEmail) => checkEmail.email === email);
    if (emailExist) {
      Swal.fire({
        icon: "warning",
        title: "Alert!",
        text: "user with this email already exist",
      });
      return;
    }
    //  Here fetch create user api
    const res = await fetch("http://localhost:8001/api/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, role }),
    });
    // show weetalert if user created successfuly
    if (res.status === 200) {
      Swal.fire({
        title: "Good job!",
        text: "successfuly created",
        icon: "success",
      });
    }
    // Again input fields empty again after creating user
    setCredentials({
      name: "",
      email: "",
      role: "",
    });
  };

  // change input fields value
  const onchange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Function for getting all users
  const getAllUsers = async () => {
    await fetch("http://localhost:8001/api/auth/getusers", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
      });
  };
  useEffect(() => {
    getAllUsers();
  });

  // Function for deleting user with sweetalert
  const deletePosts = async (id) => {
    const { isConfirmed } = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Deleted!",
          text: "User has been deleted.",
          icon: "success",
        });
      }
      return result;
    });
    if (isConfirmed) {
      await fetch(`http://localhost:8001/api/auth/deleteuser/${id}`, {
        method: "DELETE",
      });
      getAllUsers();
    }
  };

  return (
    <div>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 mt-5">
            <h2>All Users List</h2>
            <div className="d-flex justify-content-end">
              <button
                type="button"
                class="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#createModal"
              >
                Create User
              </button>
            </div>
            <table className="table table-responsive">
              <thead>
                <tr>
                  <td>Name</td>
                  <td>Email</td>
                  <td>Role</td>
                  <td>Action</td>
                </tr>
              </thead>
              <tbody>
                {user &&
                  user.map((data) => {
                    return (
                      <tr>
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.role}</td>
                        <td>
                          <i
                            className="fas fa-trash"
                            style={{ color: "blue" }}
                            onClick={() => deletePosts(data._id)}
                          ></i>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/*user Modal */}
      <div
        class="modal fade"
        id="createModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add User
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div class="modal-body">
              <form ref={refForm} onSubmit={createUser}>
                <input
                  className="form-control mt-3"
                  type="text"
                  placeholder="name"
                  name="name"
                  value={credentials.name}
                  onChange={onchange}
                />
                <div id="nameError" className="text-danger"></div>
                <input
                  className="form-control mt-3"
                  type="email"
                  placeholder="email"
                  name="email"
                  value={credentials.email}
                  onChange={onchange}
                />
                <div id="emailError" className="text-danger"></div>
                <input
                  className="form-control mt-3"
                  type="role"
                  placeholder="role"
                  name="role"
                  value={credentials.role}
                  onChange={onchange}
                />
                <div id="roleError" className="text-danger"></div>
                <button className="btn btn-primary mt-3">Add User</button>
              </form>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
