import { logout } from '@/actions/logout'
import React from 'react'

const LogOut = () => {
    return (
        <form action={logout}>
            <button>Sign out</button>
        </form>
    )
}

export default LogOut