import { useRouter } from "next/router";

type CardProps = {
    title?: string
    subTitle?: string
}

const WelcomeCard = ({
    title = 'Ready to Join Us?',
    subTitle = 'Create an account or sign in now, and start your next adventure on the water!',
}: CardProps) => {
    const router = useRouter();

    const onPress = () => {
        router.push("/auth/login");
    }
    return (
        <div className="flex items-center justify-center min-h-screen g-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h1 className="heading text-[20px]">{title}</h1>
                <p>{subTitle}</p>
                <button
                    className="w-full px-4 py-2 text-white bg-renterBlue rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onClick={onPress}
                >
                    GET STARTED!
                </button>
            </div>
        </div>
    )
}

export default WelcomeCard;