import { Button, Container, Form, Alert } from "react-bootstrap"
import * as React from 'react'
import Layout from "../components/layout"
import { useAppStore } from "../data/store"
import { navigate } from "gatsby"

function Login() {
    const loginAction = useAppStore((state) => state.login)
    const [user, setUser] = React.useState({ username: '', password: '' })
    const loginError = useAppStore((state) => state.loginError)
    const loggedIn = useAppStore((state) => state.loggedIn)

    React.useEffect(() => {
        if (loggedIn) navigate("/")
    }, [loggedIn])

    return (
        <Layout>
            <Container>
                <h1 style={{ marginTop: '10px' }}>Login</h1>
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="username" style={{ marginBottom: '5px' }} onChange={value => setUser({ username: value.target.value, password: user.password })} />
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="password" style={{ marginBottom: '10px' }} onChange={value => setUser({ username: user.username, password: value.target.value })} />
                <Button onClick={() => loginAction(user)} variant="primary">Submit</Button>
                {loginError ? <Alert variant="danger" style={{ marginTop: '10px' }}>Wrong username or password! Hint: admin admin</Alert> : ''}
            </Container>
        </Layout>
    )
}

export default Login