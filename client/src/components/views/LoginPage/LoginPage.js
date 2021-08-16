import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { loginUser } from "../../../_actions/user_action";

function LoginPage(props) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onChange = (event) => {
        const {
            target: { name, value }
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        let body = {
            email,
            password
        }

        dispatch(loginUser(body))
            .then(response => {
                if (response.payload.loginSuccess) {
                    props.history.push("/");
                } else {
                    alert("Error");
                }
            })
    }

    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center"
            , width: "100%", height: "100vh"
        }}>
            <form style={{
                display: "flex", flexDirection: "column"
            }} onSubmit={onSubmit} >
                <label>Email</label>
                <input name="email" type="email" value={email} onChange={onChange} />
                <label>Password</label>
                <input name="password" type="password" value={password} onChange={onChange} />
                <br />
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    )
}

export default LoginPage
