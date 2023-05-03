import { useState } from 'react';
import Head from 'next/head';

function Sidebar({ isOpen, toggleSidebar } : { isOpen: boolean, toggleSidebar: () => void }) {

    // Ajouter les fonctions de contributions, favoris et recherches récentes

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <div className="header">
                <button className="toggle" onClick={toggleSidebar}>
                    <i className="fa fa-bars" style={{color: "#F1B706",}}></i>
                </button>
            </div>
            <div className="content">
                <div className="top-content">
                    <ul className='topIcons'>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-lightbulb" style={{color: "#F1B706",}}></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center', color: 'white' }}>Contributions</span>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-bookmark" style={{color: "#F1B706",}}></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center', color: 'white' }}>Favoris</span>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-clock" style={{color: "#F1B706",}}></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center', color: 'white' }}>Recherches récentes</span>
                            </div>

                        </li>
                    </ul>

                </div>
                <div className="bottom-content">
                    <div className="ground-icon">
                        <button>
                            <i className="fas fa-pen" style={{color: "#F1B706",}}></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Sidebar;
