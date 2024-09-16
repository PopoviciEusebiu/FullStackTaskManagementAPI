import React from 'react';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import {MdAdd} from "react-icons/md";
import {GrGroup} from "react-icons/gr";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";


export const SidebarGroup = [
    {
        title: 'Home',
        path: '/userHome',
        icon: <AiIcons.AiFillHome />,
        cName: 'nav-text'
    },
    {
        title: 'Chat',
        path: (groupId) => `/group/${groupId}/chat`,
        icon: <IoChatbubbleEllipsesOutline />,
        cName: 'nav-text'
    },
    {
        title: 'Add Task',
        path: '/addGroupTask',
        icon: <MdAdd />,
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
        title: 'Groups',
        path: '/groups',
        icon: <GrGroup />,
        cName: 'nav-text'
    },
    {
        title: 'Support',
        path: '/support',
        icon: <IoIcons.IoMdHelpCircle />,
        cName: 'nav-text'
    }
];