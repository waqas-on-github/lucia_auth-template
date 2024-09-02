'use client'
import { Label } from "@radix-ui/react-label";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { z } from 'zod'
import { signupSchema } from "@/schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUp } from "@/actions/signup";
import { useSignup } from "@/hooks/use-signup";



const SignUpForm = () => {


    const { register, trigger, getValues, reset, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema)
    })

    const { isPending, mutate } = useSignup()


    const submit = async () => {
        // trigger a userform to get values 
        const val = await trigger()
        if (!val) {
            console.log("form not triggerd. trigger value -->", val);
            return

        }
        // get input values 
        const inputValues = getValues()  //these value are viladated buy zod 


        // await signUp({ email: inputValues.email, password: inputValues.password })
        mutate({ email: inputValues.email, password: inputValues.password })
        reset()
    }




    return (
        <form action={submit} >
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
            <div className="space-y-1">
                <Label htmlFor="Confirm-password">Confirm Password</Label>
                <Input id="Confirm-password" placeholder="Confirm password" type="password" {...register("confirmPassword")} autoComplete="true" />
                {errors?.confirmPassword && <span className="text-sm text-red-400">{errors?.confirmPassword?.message}</span>}
            </div>


            {
                isPending ? <Button disabled >  Signup</Button>
                    : <Button type="submit"> Signup  </Button>
            }
        </form>
    );
};

export default SignUpForm;
