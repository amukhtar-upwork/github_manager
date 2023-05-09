import Image from 'next/image'
import GithubAuth from './GithubRepo'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <GithubAuth/>
    </main>
  )
}
