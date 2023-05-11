import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { FactProps } from 'types/types';
import { bus } from "../../utils/bus";
import Fact from "../Fact";

import {selectFact} from '../../events/ChainFormModalEvents';
import { useEffect } from 'react';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

export interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface Props{
    fact: FactProps;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const SearchBarModalResult = ({fact, open, setOpen}: Props) => {


  const handleClose = () => {
    setOpen(false);
  };

  const handleAddToChain = () => {
    bus.publish(selectFact(fact));
    setOpen(false);
  }

  return (
    <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
        {(() => {
            if (fact.title.length < 1) {
                const date = fact.keyDates[0].slice(0,4);
                let content: string = fact.content;

                if (fact.content.length > 30) {
                    content = fact.content.slice(0,30) + "...";
                }

                return `(${date}) - ${content}`;
            } else {
                return fact.title;
            }
        })()}

        </BootstrapDialogTitle>
        <DialogContent dividers>
            <Fact fact={fact}></Fact>
        </DialogContent>
        <DialogActions>
          <Button  onClick={handleClose}>
            Retour
          </Button>
          <Button autoFocus onClick={handleAddToChain}>
            <AddIcon/>
            Ajouter à la chaîne
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}

export default SearchBarModalResult;