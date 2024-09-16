// NavbarGroup.js
import React, { useState, useContext } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarGroup } from "./SidebarGroup";
import "../styles/navbarU.css";
import { IconContext } from 'react-icons';
import { IoMdLogOut } from "react-icons/io";
import { AddTaskContext } from "./AddTaskContext";

function NavbarGroup({ groupName, groupId }) {
    const [sidebar, setSidebar] = useState(false);
    const { openAddTask } = useContext(AddTaskContext);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <div className='navbar'>
                    <Link to='#' className='menu-bars'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </Link>
                    <h1 style={{ flex: 1, textAlign: 'center', color: 'white', margin: 0, paddingLeft: '80px' }} className="site-title">
                        {groupName}
                    </h1>
                    <Link to='/logout' className='logout-button'>
                        <IoMdLogOut />
                        <span>Logout</span>
                    </Link>
                </div>
                <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                    <ul className='nav-menu-items' onClick={showSidebar}>
                        <li className='navbar-toggle'>
                            <Link to='#' className='menu-bars'>
                                <AiIcons.AiOutlineClose />
                            </Link>
                        </li>
                        {SidebarGroup.map((item, index) => {
                            if (item.title === "Add Task") {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to="#" onClick={openAddTask}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            }
                            if (item.title === "Chat") {
                                return (
                                    <li key={index} className={item.cName}>
                                        <Link to={`/group/${groupId}/chat`}>
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </Link>
                                    </li>
                                );
                            }
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </IconContext.Provider>
        </>
    );
}

export default NavbarGroup;
