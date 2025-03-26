import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Collapse } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PersonIcon from '@mui/icons-material/Person';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HistoryIcon from '@mui/icons-material/History';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AssignmentIcon from '@mui/icons-material/Assignment';

import 'bootstrap/dist/css/bootstrap.min.css';
import './css/NavigationBar.css';

const NavigationBar = ({ isPin }) => {
  const [showNavBar, setShowNavBar] = useState(isPin);
  const [historyOpen, setHistoryOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPin) {
      const handleMouseMove = (event) => {
        if (event.clientX <= 300) {
          setShowNavBar(true);
        } else {
          setShowNavBar(false);
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isPin]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const toggleHistory = () => {
    setHistoryOpen(!historyOpen);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={showNavBar}
      sx={{
        width: 250,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 250,
          boxSizing: 'border-box',
          backgroundColor: '#343a40',
          color: '#fff',
        },
      }}
    >
      <div className="d-flex flex-column h-100">
        {/* Brand/Logo */}
        <Link
          to="/"
          className="navbar-brand p-3 text-white text-decoration-none fs-4"
          style={{ backgroundColor: '#212529' }}
        >
          Camera AI Web
        </Link>

        {/* Navigation Links */}
        <List>
          <ListItem button component={Link} to="/" className="nav-link">
            <ListItemIcon>
              <HomeIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </ListItem>
          
          <ListItem button onClick={toggleHistory} className="nav-link">
            <ListItemIcon>
              <HistoryIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Lịch sử" />
            {historyOpen ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          
          <Collapse in={historyOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem 
                button 
                component={Link} 
                to="/truck" 
                className="nav-link"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <DirectionsCarIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Xe công/ xe tải" />
              </ListItem>
              <ListItem 
                button 
                component={Link} 
                to="/moto" 
                className="nav-link"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <TwoWheelerIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Xe 2 bánh" />
              </ListItem>
              <ListItem 
                button 
                component={Link} 
                to="/nhan-vien" 
                className="nav-link"
                sx={{ pl: 4 }}
              >
                <ListItemIcon>
                  <PersonIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Nhân viên" />
              </ListItem>
            </List>
          </Collapse>

          <ListItem button component={Link} to="/signed-vehicle" className="nav-link">
            <ListItemIcon>
              <AssignmentIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Phương tiện đăng ký" />
          </ListItem>
        </List>

        <Divider sx={{ backgroundColor: '#495057' }} />

        {/* Logout Link */}
        <List className="mt-auto">
          <ListItem button onClick={handleLogout} className="nav-link">
            <ListItemIcon>
              <ExitToAppIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default NavigationBar;