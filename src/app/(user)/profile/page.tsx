import LogOut from "@/components/logOut"
import { validateRequest } from "@/lib/auth"
import { db } from "@/lib/db"
import { redirect } from "next/navigation"

const page = async () => {

    const { session, user } = await validateRequest()
    if (!session || !session.id) {
        redirect('/login')
    }
    const userData = await db.user.findUnique({ where: { id: user?.id } })
    return (
        <>
            <h1>logged in as </h1>
            {userData?.email && <p>{userData.email}</p>}

            <LogOut />



        </>

    )
}

export default page