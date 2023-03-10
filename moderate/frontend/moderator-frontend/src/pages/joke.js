import * as React from "react"
import { Link, navigate } from "gatsby"
import { Form, FloatingLabel, Stack, Button } from "react-bootstrap"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { ApiConnection } from "../data/api-connection"
import { useAppStore } from "../data/store"

const networkClient = new ApiConnection()

const JokeTemplate = () => {
  const setLoading = useAppStore(state => state.setLoading)
  const clearJokes = useAppStore(state => state.clearJokes)
  const loggedIn = useAppStore(state => state.loggedIn)

  const joke = useAppStore(state => state.selectedJoke)
  const [types, setTypes] = React.useState([])
  const [formData, setFormData] = React.useState({
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
  })

  React.useEffect(() => {
    if (!loggedIn) return navigate('/login')
    networkClient.getTypes().then(x => setTypes(x))
  }, [""])

  return (
    <Layout>
      <Link to="/">
        <i class="bi bi-arrow-bar-left"></i> back to homepage
      </Link>
      <h1>Edit Joke {joke._id}</h1>
      <FloatingLabel controlId="floatingInput" label="Setup" className="mb-3">
        <Form.Control
          as="textarea"
          value={formData.setup}
          onChange={value =>
            setFormData({
              type: formData.type,
              setup: value.target.value,
              punchline: formData.punchline,
            })
          }
        />
      </FloatingLabel>
      <FloatingLabel
        controlId="floatingInput"
        label="Punchline"
        className="mb-3"
      >
        <Form.Control
          as="textarea"
          value={formData.punchline}
          onChange={value =>
            setFormData({
              type: formData.type,
              setup: formData.setup,
              punchline: value.target.value,
            })
          }
        ></Form.Control>
      </FloatingLabel>
      <Form.Select
        aria-label="Type"
        value={formData.type}
        onChange={value =>
          setFormData({
            type: value.target.value,
            setup: formData.setup,
            punchline: formData.punchline,
          })
        }
      >
        {types.flatMap(type => (
          <option key={type.id} value={type.id}>
            {type.type}
          </option>
        ))}
      </Form.Select>
      <Stack
        direction="horizontal"
        gap={2}
        style={{ marginTop: 10 }}
        justifyContent="right"
      >
        <Button
          className="ms-auto"
          variant="primary"
          onClick={async () => {
            setLoading(true)
            console.log(await networkClient.updateJoke(joke._id, formData))
            clearJokes()
            setLoading(false)
            navigate("/")
          }}
        >
          Save
        </Button>
        <Button
          variant="success"
          onClick={async () => {
            setLoading(true)
            console.log(await networkClient.updateJoke(joke._id, formData))
            console.log(await networkClient.approveJoke(joke._id))
            clearJokes()
            setLoading(false)
            navigate("/")
          }}
        >
          <i className="bi bi-check-lg" style={{ fontSize: 15 }} /> Accept
        </Button>
      </Stack>
    </Layout>
  )
}

export const Head = () => <Seo title="Using DSG" />

export default JokeTemplate
