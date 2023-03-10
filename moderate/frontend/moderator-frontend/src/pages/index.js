import * as React from "react"
import { Link, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { JokeTemplate as Joke } from "./joke"

import Layout from "../components/layout"
import Seo from "../components/seo"
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap/dist/css/bootstrap.min.css"
import { ApiConnection } from "../data/api-connection"
import { Table, Button, Alert, Stack } from "react-bootstrap"
import { useAppStore } from "../data/store"

const networkClient = new ApiConnection()

const IndexPage = () => {
  //Global State variables & functions
  const jokes = useAppStore(state => state.jokes)
  const clear = useAppStore(state => state.clear)
  const fetchJokes = useAppStore(state => state.fetchJokes)
  const loggedIn = useAppStore(state => state.loggedIn)

  //Component state variables
  const [status, setStatus] = React.useState("")

  React.useEffect(() => {
    if (!loggedIn) return navigate('/login')
    fetchJokes()
    clear()
  }, [status])

  return (
    <Layout>
      <Stack direction="horizontal">
        <h1>Joke Moderation Center</h1>
        <Button
          className="ms-auto"
          variant="primary"
          onClick={() => fetchJokes()}
        >
          <i className="bi bi-arrow-repeat" style={{ fontSize: 20 }} />
        </Button>
      </Stack>
      <Table hover>
        <thead>
          <tr>
            <th>Setup</th>
            <th>Punchline</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jokes.flatMap(x => (
            <ListItem item={x} setStatus={setStatus}></ListItem>
          ))}
        </tbody>
      </Table>
      {getAlert(status)}
      {async () => {
        await sleep(3000)
        if (status != undefined) setStatus("")
      }}
    </Layout>
  )
}

const getAlert = status => {
  let alert
  switch (status) {
    case "success":
      alert = <Alert variant="success">Action successful!</Alert>
      break
    case "danger":
      alert = <Alert variant="danger">Action failed!</Alert>
      break
  }
  return alert
}

const ListItem = ({ item, setStatus }) => {
  const setSelectedJoke = useAppStore(state => state.setSelectedJoke)
  const setLoading = useAppStore(state => state.setLoading)
  const fetchJokes = useAppStore(state => state.fetchJokes)

  return (
    <tr>
      <td>{item.setup}</td>
      <td>{item.punchline}</td>
      <td>{item.type}</td>
      <td>
        <Button
          variant="success"
          onClick={() => {
            setLoading(true)
            setStatus(
              networkClient.approveJoke(item._id) ? "success" : "danger"
            )
            fetchJokes()
            setLoading(false)
          }}
        >
          <i className="bi bi-check-lg" style={{ fontSize: 15 }} />
        </Button>{" "}
        <Button
          variant="danger"
          onClick={() => {
            setStatus(networkClient.rejectJoke(item._id) ? "success" : "danger")
            fetchJokes()
          }
          }
        >
          <i className="bi bi-trash" style={{ fontSize: 15 }} />
        </Button>{" "}
        <Link to="/joke" state={{ joke: "test" }}>
          <Button variant="outline-primary" onClick={() => setSelectedJoke(item)}>
            <i className="bi bi-primary bi-pencil" style={{ fontSize: 15 }} />
          </Button>{" "}
        </Link>
      </td>
    </tr>
  )
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
