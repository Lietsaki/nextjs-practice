import MeetupDetail from "../../components/meetups/MeetupDetail"
import { MongoClient, ObjectId } from 'mongodb'
import Head from 'next/head'
import { Fragment } from "react"

const MeetupDetails = (props) => {
  return (
    <Fragment>
      <Head>
        <title>{props.meetupData.title}</title>
        <meta name="description" content={props.meetupData.description} />
      </Head>
      <MeetupDetail {...props.meetupData} />
    </Fragment>
  )
}

// If getStaticProps is used in a dynamic page (as this one), getStaticPaths must also be used.
// This is because Next.js needs to know for which ID values it should pre-generate the page.
// Here we return an object with the following structure:
// ? getStaticProps will only be executed for the specified paths if fallback is set to false, and for all if it's true.
export async function getStaticPaths() {
  const client = await MongoClient.connect('mongodb+srv://ricardo:<PASSWORD>@cluster0.e1bkd.mongodb.net/meetups?retryWrites=true&w=majority')
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()   // fetch only the _id
  client.close()

  return {
    // Fallback indicates if the paths array contains all supported meetupId values. 
    // False means it does contain all supported values, so if the user enters anything other than m1 or m2, they'd see a 404 error.
    // If you set it to true, a page will be generated dynamically on the server for the incoming request that's not present in paths (m3, following our example)
    // true is then a great way to pre-generate our most popular pages and let others be pre-generated on demand.
    fallback: false,
    paths: meetups.map(meetup => ({ params: { meetupId: meetup._id.toString() } }))
    // paths: [
    //   { params: { meetupId: 'm1' } },
    //   { params: { meetupId: 'm2' } },
    // ]
  }
}

export async function getStaticProps(context) {
  const meetupId = context.params.meetupId
  const client = await MongoClient.connect('mongodb+srv://ricardo:<PASSWORD>@cluster0.e1bkd.mongodb.net/meetups?retryWrites=true&w=majority')
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const selectedMeetup = await meetupsCollection.findOne({ _id: new ObjectId(meetupId) })
  const { _id, ...restOfMeetup } = selectedMeetup
  client.close()


  // Fetch data for a single meetup
  return {
    props: {
      meetupData: { ...restOfMeetup, _id: _id.toString() }
    }
  }
}

export default MeetupDetails