import React from "react";
import { Link, useMatch, useResolvedPath } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { IoMdLogOut } from "react-icons/io";
import { TbFileExport } from "react-icons/tb";

export default function Navbar() {
    return (
        <nav className="nav">
            <Link to="/profile" className="site-title">
                Task Management
            </Link>
            <ul>
                <CustomLink to="/profile"> <CgProfile size="1.5em" /> Profile</CustomLink>
                <CustomLink to="/export"> <TbFileExport size="1.5em" /> File Export</CustomLink>
                <CustomLink to="/find">See Users</CustomLink>
                <CustomLink to="/create">Create User</CustomLink>
                <CustomLink to="/delete">Delete Users</CustomLink>
                <CustomLink to="/usersUpdate">Update Users</CustomLink>
                <CustomLink to="/logout"> <IoMdLogOut size="1.5em" />Log-out</CustomLink>
            </ul>
        </nav>
    );
}

function CustomLink({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    );
}
