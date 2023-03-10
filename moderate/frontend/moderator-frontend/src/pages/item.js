import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const SecondPage = () => (
  <Layout>
    <h1>This is a demo!</h1>
  </Layout>
)

export const Head = () => <Seo title="Page two" />

export default SecondPage
