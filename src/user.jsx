import React, { memo } from "react";
function User(props) {
    console.log('---------------------------', props);
    return (
        <>
            <section>
                <h1>Username : {props.name}</h1>
                <h1>Email : {props.email}</h1>
            </section>
        </>
    )
}

export default memo(User);