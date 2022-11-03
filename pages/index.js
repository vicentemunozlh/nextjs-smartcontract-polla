import styles from "../styles/Home.module.css"
import PollaEntrance from "../components/PollaEntrance"
import { useMoralis } from "react-moralis"

export default function Home() {
    const { isWeb3Enabled, chainId } = useMoralis()
    return (
        <div className={styles.container}>
            <PollaEntrance />
        </div>
    )
}
