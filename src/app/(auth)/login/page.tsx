"use client"

import { Input } from '@/src/components/ui/input'
import { useAuthStore } from '@/src/store/Auth'
import { Label } from '@radix-ui/react-label'
import { IconBrandGithub, IconBrandGoogle } from '@tabler/icons-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

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

function LoginPage() {

    const {login} = useAuthStore()
    const router = useRouter()
    const [isLoading,setIsLoading] = useState(false)
    const [error,setError] = useState("")

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
    
        // collect data
    
        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")
    
        //validate
    
        if (!email || !password) {
            setError(() => "Please fill out all the fields" )
            return
        }
    
        //call the store
    
       setIsLoading(true)
       setError("")
       
       const loginResponse = await login( email?.toString(), password?.toString() )
    
        if (loginResponse.error) {
            setError(()=>loginResponse.error!.message)
            setIsLoading(false)
        } else {
            // Redirect to questions page after successful login
            router.push("/questions")
        }
    
      }

   return (
        <div className="mx-auto w-full max-w-md rounded-none border border-solid border-white/30 bg-white p-4 shadow-input dark:bg-black md:rounded-2xl md:p-8">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
                Login to AskBit
            </h2>
            <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
                Login to AskBit
                <br /> If you don&apos;t have an account,{" "}
                <Link href="/register" className="text-orange-500 hover:underline">
                    register
                </Link>{" "}
                with AskBit
            </p>

            {error && (
                <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
            <form className="my-8" onSubmit={handleSubmit}>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                    className="text-black"
                        id="email"
                        name="email"
                        placeholder="projectmayhem@fc.com"
                        type="email"
                    />
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password">Password</Label>
                    <Input className="text-black" id="password" name="password" placeholder="••••••••" type="password" />
                </LabelInputContainer>

                <button
                    className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    type="submit"
                    disabled={isLoading}
                >
                    Log in &rarr;
                    <BottomGradient />
                </button>

                <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

                <div className="flex flex-col space-y-4">
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            Google
                        </span>
                        <BottomGradient />
                    </button>
                    <button
                        className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black shadow-input dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        disabled={isLoading}
                    >
                        <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                            GitHub
                        </span>
                        <BottomGradient />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default LoginPage