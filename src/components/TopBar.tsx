import { useState } from 'react';
import Head from 'next/head';

function TopBar() {
    return (
        <div className="topbar">
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <div className="header">
                <div className="title">
                    <h1>PERKASTOR</h1>
                    {/* <div className="logo">
                        <img src="/logo.png" alt="logo" />
                    </div> */}
                </div>
                <div className="connexion">
                    <button>
                        <i className="fas fa-user"></i>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default TopBar;
