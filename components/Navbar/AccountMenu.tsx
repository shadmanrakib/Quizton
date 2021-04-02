import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Link from "next/link";
import { auth } from '../../config/firebaseClient';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      return await auth.signOut();
    } catch (err) {
      return err;
    }
  };

  return (
    <div>
      <AccountCircleIcon fontSize="large" aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}/>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={() => {
            handleSignOut();
            handleClose();
        }}>
          Sign out
        </MenuItem>
      </Menu>
    </div>
  );
}