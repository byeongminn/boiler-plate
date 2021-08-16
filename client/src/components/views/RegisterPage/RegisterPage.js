import React, { useState } from 'react'
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_action";

function RegisterPage(props) {
    const dispatch = useDispatch();

    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const onChange = (event) => {
        const {
            target: { name, value }
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "name") {
            setName(value);
        } else if (name === "password") {
            setPassword(value);
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        }
    }

    const onSubmit = (event) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            return alert("비밀번호와 비밀번호 확인은 같아야 합니다.");
        }

        let body = {
            email,
            password,
            name
        }

        dispatch(registerUser(body))
            .then(response => {
                if (response.payload.success) {
                    props.history.push("/login");
                } else {
                    alert("Failed to sign up.");
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

                <label>Name</label>
                <input name="name" type="text" value={name} onChange={onChange} />

                <label>Password</label>
                <input name="password" type="password" value={password} onChange={onChange} />

                <label>Confirm Password</label>
                <input name="confirmPassword" type="password" value={confirmPassword} onChange={onChange} />
                <br />
                <button type="submit">
                    회원 가입
                </button>
            </form>
        </div>
    )
}

export default RegisterPage
