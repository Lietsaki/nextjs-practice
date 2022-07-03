// ? /api/new-meetup
import { MongoClient } from 'mongodb'

export default async (req, res) => {

  if (req.method === "POST") {
    const { title, img, address, description } = req.body
    const client = await MongoClient.connect('mongodb+srv://ricardo:<PASSWORD>@cluster0.e1bkd.mongodb.net/?retryWrites=true&w=majority')
    // db name can be put there or after '.net/' in the connection string. If no db name is specified, a 'test' db will be used (and created if it didn't exist)
    // db names put here take priority over the one in the connection string. That is, if you put different ones, the one yo specify here will be used.
    const db = client.db('meetups')
    const meetupsCollection = db.collection('meetups')
    const insertResponse = await meetupsCollection.insertOne({ title, img, address, description })
    // console.log("your res")
    // console.log(insertResponse)
    client.close()

    res.status(201).json({ message: "Meetup created" })
  }
}

