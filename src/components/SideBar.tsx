import { useState } from 'react';
import Head from 'next/head';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true); // unused for now, maybe later if we want to hide the sidebar

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Ajouter les fonctions de contributions, favoris et recherches récentes

    return (
        <div className="sidebar">
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <div className="header">
                <button className="toggle" onClick={toggleSidebar}>
                    <i className="fa fa-bars"></i>
                </button>
            </div>
            <div className="content">
                <div className="top-content">
                    <ul className='topIcons'>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-lightbulb"></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center' }}>Contributions</span>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-bookmark"></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center' }}>Favoris</span>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button>
                                    <i className="far fa-clock"></i>
                                </button>
                                <span style={{ fontSize: '10px', marginTop: '5px', textAlign: 'center' }}>Recherches récentes</span>
                            </div>

                        </li>
                    </ul>

                </div>
                <div className="bottom-content">
                    <div className="ground-icon">
                        <button>
                            <i className="fas fa-pen"></i>
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default Sidebar;
