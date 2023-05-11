
import Head from 'next/head';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { bus } from '../utils/bus';
import { contributionClickEvent } from '../events/ContributionClickEvent';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';

function Sidebar({ isOpen, toggleSidebar, onSidebarItemClick, insertMode, setInsertMode }:
    { isOpen: boolean, toggleSidebar: () => void, onSidebarItemClick: ({ item }: { item: String }) => void, insertMode: boolean, setInsertMode: ({ insertMode }: { insertMode: boolean }) => void }) {
    
    const [editMode, setEditMode] = useState(false);
    const { data: session, status } = useSession();

    const handleClick = ({ item }: { item: String }) => { 
        onSidebarItemClick({ item });

        if(item == "edit"){
            // si l'utilisateur n'est pas connecté, on le redirige vers la page de connexion
            if( status != "authenticated" ){
                window.location.href = "/auth";
            }else{
                setEditMode(!editMode);
                bus.publish(contributionClickEvent(!editMode));
            }
        }
        if (item == "addEvent") {
            window.location.href = "/eventForm";
        }
    }

    return (
        <div className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="content">
                <div className="top-content">
                    <ul className='topIcons'>
                        <li>
                            <div className="icon">
                                <Button variant="text"
                                    style={{ color: "#F1B706", cursor:"pointer"}}
                                    title={editMode ? 'Accéder à la mode Consultation' : 'Accéder à la mode Edition'} 
                                    onClick={() => handleClick({ item: "edit" })} 
                                >
                                    {editMode ? < VisibilityIcon style={{ color: '#F1B706' }} /> :  <EditIcon style={{ color: '#F1B706' }}/>}
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>{editMode ? 'Accès mode Consultation' : 'Accès mode Edition'}</span>
                                </Button>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <Button variant="text"
                                        style={{ color: "#F1B706", cursor:"pointer"}}
                                        title='Accéder au formulaire pour ajouter un évènement' 
                                        onClick={() => handleClick({ item: "addEvent" })}>
                                    <AddCircleIcon style={{ color: '#F1B706' }} />
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Ajouter un évènement</span>
                                </Button>
                            </div>

                        </li>
                    </ul>

                </div>
            </div>

        </div>
    );
}

export default Sidebar;
