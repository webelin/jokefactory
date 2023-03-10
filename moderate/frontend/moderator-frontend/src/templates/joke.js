import * as React from "react"
import { Link, navigate } from "gatsby"
import { Form, FloatingLabel, Stack, Button } from "react-bootstrap"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { ApiConnection } from "../data/api-connection"
const networkClient = new ApiConnection()

const JokeTemplate = ({ location: { state } }) => {
  const [joke, setJoke] = React.useState({})
  const [types, setTypes] = React.useState([])
  const [formData, setFormData] = React.useState({
    type: joke.type,
    setup: joke.setup,
    punchline: joke.punchline,
  })

  React.useEffect(() => {
    networkClient.getTypes().then(x => setTypes(x.data))
  }, [""])

  return (
    <Layout>
      <Link to="/">
        <i class="bi bi-arrow-bar-left"></i> back to homepage
      </Link>
      <h1>Edit Joke {state.joke}</h1>
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
          onClick={() =>
            console.log(networkClient.updateJoke(joke._id, formData))
          }
        >
          Save
        </Button>
        <Button
          variant="success"
          onClick={async () => {
            console.log(await networkClient.updateJoke(joke._id, formData))
            console.log(await networkClient.approveJoke(joke._id))
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
