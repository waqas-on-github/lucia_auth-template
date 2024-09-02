'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"

const AuthPageToggler = () => {

    const pathName = usePathname()


    return (
        <>
            {pathName.includes('/login') ?

                <p>Don't have an account ? <Link href='/signup' > signup </Link> </p> :
                <p>Already have an account ? <Link href='/login'> login </Link></p>
            }

        </>
    )
}

export default AuthPageToggler