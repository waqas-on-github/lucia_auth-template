import AuthPageToggler from "@/components/authPageToggler";



export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {



    return (
        <>
            <div className="flex items-center justify-center flex-col  mt-[30vh] " >


                <div>
                    {children}
                </div>
                <div>

                    <AuthPageToggler />
                </div>



            </div>
        </>
    );
}
