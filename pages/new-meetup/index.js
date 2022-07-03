import NewMeetupForm from "../../components/meetups/NewMeetupForm"
import { useRouter } from 'next/router'
import Head from 'next/head'
import { Fragment } from "react"


const NewMeetupPage = () => {
  const router = useRouter()

  const addMeetupHandler = async (meetupData) => {
    // We can use an absolute path bacause the api is hosted in the same server as the backend
    const res = await fetch('/api/new-meetup', {
      method: 'POST',
      body: JSON.stringify(meetupData),
      headers: {
        'Content-Type': 'application/json'
      }
    })

    // const data = await res.json()
    // console.log('your response data in the frontend')
    // console.log(data)
    router.push('/')
  }

  return (
    <Fragment>
      <Head>
        <title>Create a new meetup</title>
        <meta name="description" content="Create a new React meetup" />
      </Head>
      <NewMeetupForm onAddMeetup={addMeetupHandler} />
    </Fragment>
  )
}

export default NewMeetupPage