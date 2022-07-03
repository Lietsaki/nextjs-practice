import MeetupList from "../components/meetups/MeetupList";
import Head from 'next/head'
import { MongoClient } from 'mongodb' // imported modules that you use only in server-side functions will be bundled in the server, not the client
import { Fragment } from "react";

const HomePage = (props) => {
  return (
    <Fragment>
      <Head>
        <title>Next.js Meetups</title>
        <meta name="description" content="Browse a huge list of React Meetups" />

      </Head>
      <MeetupList meetups={props.meetups} />
    </Fragment>
  )
}

// This function must be called getStaticProps and must be within the pages folder. Next.js will call it before the default component that we're exporting in this file.
// Here we can perform API requests or access the filesystem. The code here will never reach the machine of your visitors, it'll be executed during the build process.
// You must always return an object from getStaticProps. That object contains another object called 'props' which will be the props passed to the component.
export async function getStaticProps() {
  const client = await MongoClient.connect('mongodb+srv://ricardo:iYfsIWVVrAGz02lk@cluster0.e1bkd.mongodb.net/meetups?retryWrites=true&w=majority')
  const db = client.db()
  const meetupsCollection = db.collection('meetups')
  const meetups = await meetupsCollection.find().toArray()
  client.close()

  return {
    props: {
      meetups: meetups.map(item => {
        item.id = item._id.toString()
        delete item._id
        return item
      })
    },
    // Add incremental static generation. See https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every 10 seconds. 
    // - If revalidate is omitted, Next.js will use the default value of false (no revalidation)
    revalidate: 10
  }
}

// Perform api requests or access the file system, or peform operations with credentials that should not be shown to your users.
// Any code written here will always run in the server, never on the client.
// The difference with getStaticProps is that getServerSideProps runs on every request. It runs the content of this function, pre-renders the page and returns it.
// For that reason the revalidate option is not a thing here.
// export async function getServerSideProps(context) {
//   const req = context.req
//   const res = context.res

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS
//     }
//   }
// }

export default HomePage

