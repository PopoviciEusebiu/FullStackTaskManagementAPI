import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import { MdAdd } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { FaTasks } from "react-icons/fa";
import { IoMdLogOut } from "react-icons/io";
import { GrHistory } from "react-icons/gr";
import { GrGroup } from "react-icons/gr";


export const SidebarData = [
    {
        title: 'Home',
        path: '/userHome',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Profile',
        path: '/userProfile',
        icon: <CgProfile />,
        cName: 'nav-text'
    },
    {
        title: 'Add personal task',
        path: '/addTask',
        icon: <MdAdd />,
        cName: 'nav-text'
    },
    {
        title: 'My tasks',
        path: '/tasks',
        icon: <FaTasks />,
        cName: 'nav-text'
    },
    {
        title: 'Create group',
        path: '/createGroup',
        icon: <MdAdd />,
        cName: 'nav-text'
    },
    {
        title: 'My groups',
        path: '/myGroups',
        icon: <GrGroup />,
        cName: 'nav-text'
    },
    {
        title: 'All groups',
        path: '/groups',
        icon: <GrGroup />,
        cName: 'nav-text'
    },
    {
        title: 'History',
        path: '/history',
        icon: <GrHistory />,
        cName: 'nav-text'
    },

    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
];