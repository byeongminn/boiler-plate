import React, { useEffect } from 'react';
import axios from "axios";

function LandingPage(props) {
    useEffect(() => {
        axios.get("/api/hello")
        .then(response => console.log(response.data));
    }, [])

    const onClick = () => {
        axios.get("/api/users/logout")
            .then(response => {
                if (response.data.success) {
                    props.history.push("/login");
                } else {
                    alert("로그아웃에 실패하였습니다.");
                }
            })
    }

    return (
        <div style={{
            display: "flex", justifyContent: "center", alignItems: "center"
            , width: "100%", height: "100vh"
        }}>
            <h2>LandingPage</h2>
            <button onClick={onClick}>로그아웃</button>
        </div>
    )
}

export default LandingPage
