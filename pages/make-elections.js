import Head from "next/head"
import styles from "../styles/Home.module.css"
import Header from "../components/Header"
import PollaEntrance from "../components/PollaEntrance"
import Link from "next/link"
import { Form, useNotification } from "web3uikit"
import { ethers } from "ethers"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { useEffect, useState } from "react"

export default function Home() {
    const { Moralis, isWeb3Enabled, chainId: chainIdHex } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const pollaAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()
    async function approveAndList(data) {
        console.log("Approving ... ")
        const E0 = data.data[0].inputResult
        const E1 = data.data[1].inputResult
        const E2 = data.data[2].inputResult
        const picks = [E0, E1, E2]

        const listElections = {
            abi: abi,
            contractAddress: pollaAddress,
            functionName: "EleccionesJugador",
            params: {
                _elecciones: picks,
            },
        }

        await runContractFunction({
            params: listElections,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Election Listing",
            title: "Election listed",
            position: "topR",
        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Smart Contract Polla</title>
                <meta
                    name="description"
                    content="Esta es una polla del mundial Qatar 2022 realizada con la tecnologia de los smart contracts para incentivar la tranparencia y descentralizacion"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h2 className="py-4 px-4 font-bold text-2xl">Player Elections Page </h2>
            <div>Warning: Don't lose innecesary gas fees by not entering the polla first! </div>
            <div>
                You Must Pay enter fee in
                <Link href="/">
                    <a className="mr-4 p-6">Enter Polla</a>
                </Link>
                first!!
            </div>

            <div>Modo de elegir por partido: </div>
            <div>
                Local vs. Visita --- Eleccion --- 0 = Gana Local ; 1= Gana Visita ; 2= Empate
            </div>
            <Form
                onSubmit={approveAndList}
                data={[
                    {
                        name: "Qatar vs. Ecuador",
                        type: "number",
                        validation: {
                            numberMax: 2,
                            numberMin: 0,
                            required: true,
                        },
                        value: "",
                    },
                    {
                        name: "Inglaterra vs. Iran",
                        type: "number",
                        validation: {
                            numberMax: 2,
                            numberMin: 0,
                            required: true,
                        },
                        value: "",
                    },
                    {
                        name: "Senegal vs. Holanda",
                        type: "number",
                        validation: {
                            numberMax: 2,
                            numberMin: 0,
                            required: true,
                        },
                        value: "",
                    },
                ]}
                title="Pick Your Winners!"
                id="Main Form"
            />
        </div>
    )
}
