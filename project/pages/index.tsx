import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Social Fit</title>
        <meta name="description" content="Social Fit - Sua plataforma de fitness social" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen p-4">
        <h1 className="text-4xl font-bold text-center">
          Bem-vindo ao Social Fit
        </h1>
      </main>
    </div>
  )
}

export default Home 