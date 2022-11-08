import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="p-5 border-b-2 flex flex-row justify-between items-center">
            <h1 className="py-4 px-4 font-bold text-3xl">
                Polla Smart Contract Mundial Qatar 2022
            </h1>
            <div className="flex flex-row items-center">
                <Link href="/">
                    <a className="mr-4 p-6">Enter Polla</a>
                </Link>

                <Link href="/make-elections">
                    <a className="mr-4 p-6">Make Your Games Elections</a>
                </Link>

                <Link href="/check-elections">
                    <a className="mr-4 p-6">Check A Account Game Pick</a>
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
