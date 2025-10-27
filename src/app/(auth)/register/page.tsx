"use client"

import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/store/Auth'
import { Label } from '@radix-ui/react-label'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import Link from 'next/link'
import React, { useState, useEffect } from 'react'

type DivProps = React.HTMLAttributes<HTMLDivElement>

const LabelInputContainer: React.FC<DivProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`flex flex-col ${className}`} {...props}>
            {children}
        </div>
    )
}

const BottomGradient: React.FC = () => {
    return (
        <span
            aria-hidden="true"
            className="absolute left-0 right-0 bottom-0 h-2 pointer-events-none rounded-b-md bg-gradient-to-b from-transparent to-black/10 dark:to-white/6"
        />
    )
}

function RegisterPage() {
    const {createAccount,login} = useAuthStore()
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState("")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])
  
  const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // collect data

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName")
    const lastName = formData.get("lastName")
    const email = formData.get("email")
    const password = formData.get("password")

    //validate

    if (!firstName || !lastName || !email || !password) {
        setError(() => "Please fill out all the fields" )
        return
    }

    //call the store

   setIsLoading(true)
   setError("")
   
   const response = await createAccount( `${firstName} ${lastName}`, email?.toString(), password?.toString() )

   if (response.error) {
    setError(()=> response.error!.message)
   } else{
    const loginResponse = await login(email.toString(),password.toString())
    if (loginResponse.error) {
        setError(()=>loginResponse.error!.message)
    }
   }

   setIsLoading(false)

  }

    if (!mounted) {
        return (
            <div className="relative min-h-screen overflow-hidden bg-black">
                <div className="flex min-h-screen items-center justify-center">
                    <div className="text-lg text-white">Loading...</div>
                </div>
            </div>
        )
    }

    return (
        <div className="relative min-h-screen overflow-hidden bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                        <div className="text-center">
                            <h2 className="mb-2 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-3xl font-bold text-transparent">
                                Create Account
                            </h2>
                            <p className="text-gray-400">
                                Join AskBit and start asking questions
                            </p>
                        </div>

                        {error && (
                            <p className="mt-4 text-center text-sm text-red-400">{error}</p>
                        )}
                        
                        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                            <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                <LabelInputContainer className="space-y-2">
                                    <Label htmlFor="firstName" className="text-white">First name</Label>
                                    <Input 
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-white/20" 
                                        id="firstName" 
                                        name="firstName" 
                                        placeholder="Tyler" 
                                        type="text" 
                                    />
                                </LabelInputContainer>
                                <LabelInputContainer className="space-y-2">
                                    <Label htmlFor="lastName" className="text-white">Last name</Label>
                                    <Input 
                                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-white/20" 
                                        id="lastName" 
                                        name="lastName" 
                                        placeholder="Durden" 
                                        type="text" 
                                    />
                                </LabelInputContainer>
                            </div>
                            
                            <LabelInputContainer className="space-y-2">
                                <Label htmlFor="email" className="text-white">Email Address</Label>
                                <Input
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-white/20" 
                                    id="email"
                                    name="email"
                                    placeholder="projectmayhem@fc.com"
                                    type="email"
                                />
                            </LabelInputContainer>
                            
                            <LabelInputContainer className="space-y-2">
                                <Label htmlFor="password" className="text-white">Password</Label>
                                <Input 
                                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-blue-500 focus:bg-white/20" 
                                    id="password" 
                                    name="password" 
                                    placeholder="••••••••" 
                                    type="password" 
                                />
                            </LabelInputContainer>

                            <button
                                className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-lg disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                                suppressHydrationWarning
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>

                            <div className="my-6 h-[1px] w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                            <div className="flex flex-col space-y-4">
                                <button
                                    className="flex h-12 w-full items-center justify-center space-x-2 rounded-lg bg-white/10 px-4 font-medium text-white transition-all hover:bg-white/20"
                                    type="button"
                                    disabled={isLoading}
                                    suppressHydrationWarning
                                >
                                    <IconBrandGoogle className="h-5 w-5" />
                                    <span>Continue with Google</span>
                                </button>
                                <button
                                    className="flex h-12 w-full items-center justify-center space-x-2 rounded-lg bg-white/10 px-4 font-medium text-white transition-all hover:bg-white/20"
                                    type="button"
                                    disabled={isLoading}
                                    suppressHydrationWarning
                                >
                                    <IconBrandGithub className="h-5 w-5" />
                                    <span>Continue with GitHub</span>
                                </button>
                            </div>
                        </form>
                        
                        <div className="mt-6 text-center text-sm">
                            <span className="text-gray-400">Already have an account? </span>
                            <Link href="/login" className="font-medium text-blue-400 hover:text-blue-300">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage