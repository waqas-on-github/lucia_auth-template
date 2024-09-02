import { validateRequest } from '@/lib/auth'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {

    const result = await validateRequest()

    if (!result.session || !result.user) {
        redirect('/login')
    }


    return (
        <div>this is secure route </div>
    )
}

export default page