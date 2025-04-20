// app/api/test/route.ts (App Router style)
import { MongoClient } from 'mongodb'
import { NextResponse } from 'next/server'

// Local MongoDB connection string
const uri = 'mongodb://127.0.0.1:27017'
const options = {
  connectTimeoutMS: 10000, // 10 seconds
}

export async function GET() {
  try {
    const client = new MongoClient(uri, options)
    await client.connect()
    const db = client.db('tugzone')

    // Test the connection
    await db.command({ ping: 1 })

    return NextResponse.json({
      status: 'success',
      message: 'Successfully connected to MongoDB!',
      database: db.databaseName
    })
  } catch (error: any) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: error.message || 'Failed to connect to MongoDB',
      },
      { status: 500 }
    )
  }
}
