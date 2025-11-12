import { useState, Suspense, lazy } from 'react';
import User from './user';
import './App.css';

function Newapp() {
    const [count, setCount] = useState(10);
    const [name, setName] = useState("shakith");
    const [email, setEmail] = useState("shakith@yopmail.com");
    const increment = () => {
        setCount(count + 1)
    }
    return (
        <>
            <User name={name} email={email} />
            <span>Count : {count}</span>
            <input type='button' value="Increment" onClick={increment} />
            <input type='button' value="name change" onClick={() => setName("venki")} />
            <input type='button' value="name change" onClick={() => setEmail("venki@yopmail.com")} />
        </>
    )
}

export default Newapp