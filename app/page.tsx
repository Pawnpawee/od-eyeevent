import { kv } from '@vercel/kv'
import HeroSection from '@/components/HeroSection'
import RegistrationForm from '@/components/RegistrationForm'

export const dynamic = 'force-dynamic'

export default async function Home() {
  await kv.incr('pageviews')
  return (
    <main>
      <HeroSection />
      <RegistrationForm />
    </main>
  )
}
