// React
import { useEffect, useState } from "react"

// Next.js
import type { NextPage } from "next"

// Ory SDK
import { ory } from "../pkg/sdk"

import {
  IdentityApi,
  UpdateIdentityBody,
  IdentityApiUpdateIdentityRequest,
  IdentityWithCredentials,
  IdentityWithCredentialsPassword,
  IdentityWithCredentialsPasswordConfig,
  Configuration 
} from "@ory/client"

// Import CSS
import styles from "../styles/Dashboard.module.css"

// Misc.
import { AxiosError } from "axios"

// We will use CodeBox from Ory Elements to display the session information.
import { CodeBox } from "@ory/elements"
import { HandleError } from "../pkg/hooks"

const Identity: NextPage = () => {
  const [session, setSession] = useState<string>()
  const handleError = HandleError()

  useEffect(() => {
    // If the router is not ready yet, or we already have a session, do nothing.
    ory
      .toSession()
      .then((session) => {
        setSession(JSON.stringify(session, null, 2))
      })
      .catch((err: AxiosError) => handleError(err))
  })
  


  if (session) {
    // Set variables
    const pass = "password"
    const identityId = "d8a62785-f7c0-42d6-b4c0-dbe30678cca4"
    const state = "active"
    const schema_id = "default"

    // Update
    const identity = new IdentityApi(
      new Configuration({
        // e.g. http://localhost:4000 if using proxy
        basePath: process.env.NEXT_PUBLIC_ORY_SDK_URL || "",
        // Shouldn't actually be exposed in the frontend for security reasons
        apiKey: process.env.API_KEY,
      })
    )

    const password: IdentityWithCredentialsPasswordConfig = {
      password: pass,
    }

    const passwordCredentials: IdentityWithCredentialsPassword = {
      config: password,
    }

    // The other option is to use the IdentityWithCredentialsOIDC type
    const credentials: IdentityWithCredentials = {
      password: passwordCredentials,
    }

    const identityBody: UpdateIdentityBody = {
      credentials: credentials,
      schema_id: schema_id,
      traits: {},
      state: state,
    }

    const identityRequest: IdentityApiUpdateIdentityRequest = {
      id: identityId,
      updateIdentityBody: identityBody,
    }

    identity
      .updateIdentity(identityRequest)
      .then((response) => {
        console.log(response)
      })
      .catch((err: AxiosError) => console.log(err))
  }


  return session ? (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>
            Update Identity
        </h1>
        <h3>Current Session Information</h3>
        <div className={styles.sessionDisplay}>
          {/* Displays the current session information */}
          <CodeBox>{session}</CodeBox>
        </div>
      </main>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default Identity
