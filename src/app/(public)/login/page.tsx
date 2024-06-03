import Link from 'next/link'
import { Metadata } from 'next'
import { AuthForm } from './components/form'

export const metadata: Metadata = {
  title: 'Login - Auth Boilerplate',
  description: 'Authentication forms built using shadcn.'
}

export default function AuthPage() {
  return (
    <div className="container relative h-full flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          Auth Boilerplate
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;A simple session based authentication for your Next.js
              app&rdquo;
            </p>
            <footer className="text-sm">
              <Link
                target="_blank"
                href="https://github.com/lwfe"
                className="underline underline-offset-4"
              >
                @lwfe
              </Link>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to sign in
            </p>
          </div>

          <AuthForm />
        </div>
      </div>
    </div>
  )
}
