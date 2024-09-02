'use client'
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { z } from "zod";
import { loginSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/hooks/use-login";
import { redirect, useRouter } from "next/navigation";




export const LoginForm = () => {


    const { mutate, isPending } = useLogin()
    const router = useRouter()
    // RHF initilization  
    const { register, trigger, getValues, formState: { errors }, reset } = useForm<z.infer<typeof loginSchema>>(
        {
            resolver: zodResolver(loginSchema)
        }
    )


    const submit = async () => {
        // trigger a userform to get values 
        const val = await trigger()
        if (!val) {
            console.log("form not triggerd. trigger value -->", val);
            return

        }
        // get input values 
        const inputValues = getValues()  //these value are viladated buy zod 

        mutate(inputValues, {
            onSuccess: (data) => {
                if (!data?.error && data?.data.email) {
                    router.push('/profile')
                }

            }
        })

        reset()
    }


    return (
        <form action={submit}  >
            <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Enter your email" type="email" autoComplete="true" {...register("email")} />
                {errors?.email && <span className="text-sm text-red-400">{errors?.email?.message}</span>}
            </div>
            <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input id="password" placeholder="Enter your password" type="password" autoComplete="true" {...register("password")} />
                {errors?.password && <span className="text-sm text-red-400">{errors?.password?.message}</span>}
            </div>
            {
                isPending ? <Button disabled > login</Button> : <Button type="submit" > login</Button>
            }
        </form>
    );


}
