import { useEffect, useState } from 'react';
import Head from 'next/head';
import logo from "src/images/perecastor.png";
import Link from 'next/link';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { AccountCircle, VerifiedUserOutlined } from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';

function TopBar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { data: session, status, update } = useSession({
        required: false
    })

    // Polling the session every 1 hour
    useEffect(() => {
        // TIP: You can also use `navigator.onLine` and some extra event handlers
        // to check if the user is online and only update the session if they are.
        // https://developer.mozilla.org/en-US/docs/Web/API/Navigator/onLine
        const interval = setInterval(() => update(), 1000 * 60 * 60)
        return () => clearInterval(interval)
    }, [update])

    // Listen for when the page is visible, if the user switches tabs
    // and makes our tab visible again, re-fetch the session
    useEffect(() => {
        const visibilityHandler = () => document.visibilityState === "visible" && update()
        window.addEventListener("visibilitychange", visibilityHandler, false)
        return () => window.removeEventListener("visibilitychange", visibilityHandler, false)
    }, [update])

    return (
        <div className="topbar">
            <div className="topbar-container">
                <div className="leftrow">
                    <MenuIcon className="menu" onClick={toggleSidebar} style={{ color: "#F1B706", }}/>
                    <Link href='/'>
                        <div className="title">
                            <h1>PERKASTOR</h1>
                            <div className="logo" style={{ backgroundColor: "transparent" }}>
                                <Image src={logo} alt="logo" width={40} height={40}/>
                            </div>
                        </div>
                    </Link>
                </div>
                <nav>
                    {status === "authenticated" ? (
                        <>
                            <button className="secondary-text" onClick={() => signOut()}>Déconnexion</button>
                            <Link href='/profile'>
                                <li className="connected">
                                    <AccountCircle style={{ color: "#F1B706", }}/>
                                </li>
                            </Link>
                        </>
                    ) : (
                        <Link href='/auth'>
                            <li className="connection">
                                <AccountCircle style={{ color: "#F1B706", }}/>
                            </li>
                        </Link>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default TopBar;
