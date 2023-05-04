import { useState } from 'react';
import Head from 'next/head';

import logo from "src/images/perecastor.png";

function TopBar({ toggleSidebar } : { toggleSidebar: () => void }) {
    return (
        <div className="topbar">
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <div className="header">
            <div className="icon">
                <button className="toggle" onClick={toggleSidebar}>
                    <i className="fa fa-bars" style={{color: "#F1B706",}}></i>
                </button>
            </div>
                <div className="title">
                    <h1>PERKASTOR</h1>
                    <div className="logo">
                        <img src="src/images/perecastor.png" alt="logo"/>
                    </div>
                </div>
                <div className="connexion">
                    <button>
                        <i className="fas fa-user" style={{color: "#F1B706",}}></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TopBar;
