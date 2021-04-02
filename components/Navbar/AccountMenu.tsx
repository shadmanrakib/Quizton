import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Link from "next/link";
import { useRouter } from 'next/router';

export default function AccountMenu() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            router.push("/auth/login");
            handleClose();
        }}>
            Login
        </MenuItem>
        <MenuItem onClick={() => {
            router.push("/auth/signup")
            handleClose();
        }}>
            Signup
        </MenuItem>
      </Menu>
    </div>
  );
}