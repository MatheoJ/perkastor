import { useState } from 'react';
import Head from 'next/head';
import logo from "src/images/perecastor.png";
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

function TopBar({ toggleSidebar }: { toggleSidebar: () => void }) {
    const { data: session } = useSession()

    return (
        <div className="topbar">
            <div className="container">
                <div className="left row">
                    <div className="icon">
                        <button className="toggle" onClick={toggleSidebar}>
                            <i className="fa fa-bars" style={{ color: "#F1B706", }}></i>
                        </button>
                    </div>
                    <Link href='/'>
                        <div className="title">
                            <h1>PERKASTOR</h1>
                            <div className="logo">
                                <img src="src/images/perecastor.png" alt="logo" />
                            </div>
                        </div>
                    </Link>
                </div>
                <nav>
                    {session ? (
                        <>
                            <li className="connected">
                                <Link href='/profile'><i className="fas fa-user" style={{ color: "#F1B706", }} /></Link>
                            </li>
                            <li>
                                <button onClick={() => signOut()}>Déconnexion</button>
                            </li>
                        </>
                    ) : (
                        <li className="connection">
                            <Link href='/auth'><i className="fas fa-user" style={{ color: "#F1B706", }} /></Link>
                        </li>
                    )}
                </nav>
            </div>
        </div>
    )
}

export default TopBar;
