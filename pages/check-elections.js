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
    const dispatch = useNotification()
    const [gameElection, setgameElection] = useState("0")
    const { runContractFunction } = useWeb3Contract()

    async function updateUIValues(data) {
        // Another way we could make a contract call:
        // const options = { abi, contractAddress: raffleAddress }
        // const fee = await Moralis.executeFunction({
        //     functionName: "getEntranceFee",
        //     ...options,
        // })
        console.log("Checking ... ")
        const _addressInput = data.data[0].inputResult.toString()
        const _gameIndex = data.data[1].inputResult
        const picksData = {
            abi: abi,
            contractAddress: pollaAddress,
            functionName: "vereleccionpartidox",
            params: {
                _address: _addressInput,
                partido: _gameIndex,
            },
        }
        const gameElectionFromCall = await runContractFunction({
            params: picksData,
            onSuccess: handleListSuccess,
            onError: (error) => console.log(error),
        })
        setgameElection(gameElectionFromCall)
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "Serching For Pick ...",
            title: "Pick Made Sercher",
            position: "topR",
        })
    }
    return (
        <div className={styles.container}>
            <h2 className="py-4 px-4 font-bold text-2xl"> Look for a Address game election! </h2>
            <div>
                Game number is the index of the list of games of the world cup presented next:{" "}
            </div>
            <div> 0. Qatar vs. Ecuador | 11:00 a.m. | Grupo A | Estadio Al Bayt </div>
            <div> 1. Inglaterra vs. Irán | 8:00 a.m. | Grupo B | Estadio Khalifa </div>
            <div> 2. Senegal vs. Países Bajos </div>

            <Form
                onSubmit={updateUIValues}
                data={[
                    {
                        inputWidth: "100%",
                        name: "Acount Public Address",
                        type: "text",
                        value: "",
                    },
                    {
                        name: "Game Index",
                        type: "number",
                        validation: {
                            numberMax: 2,
                            numberMin: 0,
                            required: true,
                        },
                        value: "",
                    },
                ]}
                title="Choice Sercher"
                id="Main Form"
            />
            <div> Pick = {gameElection} </div>
            <div> 0:Local ; 1:Visita ; 2:Empate </div>
        </div>
    )
}
