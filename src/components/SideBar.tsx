import { useState } from 'react';
import Head from 'next/head';
import { boolean } from 'zod';

function Sidebar({ isOpen, toggleSidebar, onSidebarItemClick, insertMode, setInsertMode }:
    { isOpen: boolean, toggleSidebar: () => void, onSidebarItemClick: ({ item }: { item: String }) => void, insertMode: boolean, setInsertMode: ({ insertMode }: { insertMode: boolean }) => void }) {


    const handleClick = ({ item }: { item: String }) => { //Fonction qui permet d'envoyer l'item sélectionné dans la sidebar à la page mapWrapper
        onSidebarItemClick({ item });
        if (item == "modeInsertion" && insertMode == false) {
            setInsertMode({ insertMode: true });
        } else {
            setInsertMode({ insertMode: false });
        }

        if (item == "addEvent"){
            
            window.location.href = "/eventForm";
        }
    }

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <Head>
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
            </Head>
            <div className="content">
                <div className="top-content">
                    <ul className='topIcons'>
                        <li>
                            <div className="icon">
                                <button title='Accéder à mes contributions' onClick={() => handleClick({ item: "contributions" })}>
                                    <i className="far fa-lightbulb" style={{ color: "#F1B706", }}></i>
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Contributions</span>
                                </button>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button title='Accéder à mes favoris' onClick={() => handleClick({ item: "favoris" })}>
                                    <i className="far fa-bookmark" style={{ color: "#F1B706", }}></i>
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Favoris</span>
                                </button>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button title='Accéder à mes recherches récentes' onClick={() => handleClick({ item: "recherches" })}>
                                    <i className="far fa-clock" style={{ color: "#F1B706", }}></i>
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Recherches récentes</span>
                                </button>
                            </div>

                        </li>

                        <li>
                            <div className="icon">
                                <button onClick={() => handleClick({ item: "addEvent" })}>
                                    <i className="far fa-google-plus" style={{ color: "#F1B706", }}></i>
                                    <span style={{ fontSize: '10px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Ajouter un évènement</span>
                                </button>
                            </div>

                        </li>
                    </ul>

                </div>
            </div>

        </div>
    );
}

export default Sidebar;
