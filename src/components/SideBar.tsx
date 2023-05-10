import Head from 'next/head';
import FolderSharedIcon from '@mui/icons-material/FolderShared';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { bus } from '../utils/bus';
import { contributionClickEvent } from '../events/ContributionClickEvent';
function Sidebar({ isOpen, toggleSidebar, onSidebarItemClick, insertMode, setInsertMode }:
    { isOpen: boolean, toggleSidebar: () => void, onSidebarItemClick: ({ item }: { item: String }) => void, insertMode: boolean, setInsertMode: ({ insertMode }: { insertMode: boolean }) => void }) {


    const handleClick = ({ item }: { item: String }) => { //Fonction qui permet d'envoyer l'item sélectionné dans la sidebar à la page mapWrapper
        onSidebarItemClick({ item });
        if (item == "modeInsertion" && insertMode == false) {
            setInsertMode({ insertMode: true });
        } else {
            setInsertMode({ insertMode: false });
        }
        if(item == "contributions"){
            bus.publish(contributionClickEvent(true));
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
                                <button title='Accéder à mes contributions' onClick={() => handleClick({ item: "contributions" })}>
                                    <FolderSharedIcon style={{ color: '#F1B706' }} />
                                    <span style={{ fontSize: '8px', marginTop: '-5px', textAlign: 'center', color: 'white' }}>Contributions</span>
                                </button>
                            </div>
                        </li>
                        <li>
                            <div className="icon">
                                <button onClick={() => handleClick({ item: "addEvent" })}>
                                    <AddCircleIcon style={{ color: '#F1B706' }} />
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
