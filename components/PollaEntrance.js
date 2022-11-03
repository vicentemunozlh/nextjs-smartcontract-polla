import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useNotification } from "web3uikit"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import styles from "../styles/Home.module.css"
import Link from "next/link"

export default function PollaEntrance() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const pollaAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const [entranceFee, setEntranceFee] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterPolla,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi, //
        contractAddress: pollaAddress, //
        functionName: "enterPolla", //
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: pollaAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    async function updateUIValues() {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUIValues()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        try {
            await tx.wait(1)
            updateUIValues()
            handleNewNotification(tx)
        } catch (error) {
            console.log(error)
        }
    }

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className={styles.container}>
            {" "}
            <h2 className="py-4 px-4 font-bold text-2xl">
                Bienvenido a la Polla Smart Contract Mundial Qatar 2022!
            </h2>
            {pollaAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                        onClick={async function () {
                            await enterPolla({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                        }}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            "Enter Polla"
                        )}
                    </button>
                    {""}

                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH </div>
                    <div>
                        After Entry Go Make Your Picks in
                        <Link href="/make-elections">
                            <a className="mr-4 p-6">Your Picks</a>
                        </Link>
                    </div>
                </div>
            ) : (
                <div>No Polla Address detected</div>
            )}
        </div>
    )
}
