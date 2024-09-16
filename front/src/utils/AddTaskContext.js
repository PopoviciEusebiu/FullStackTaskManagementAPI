import React, { createContext, useState } from 'react';

export const AddTaskContext = createContext();

export const AddTaskProvider = ({ children }) => {
    const [isAddTaskOpen, setAddTaskOpen] = useState(false);

    const openAddTask = () => setAddTaskOpen(true);
    const closeAddTask = () => setAddTaskOpen(false);

    return (
        <AddTaskContext.Provider value={{ isAddTaskOpen, openAddTask, closeAddTask }}>
            {children}
        </AddTaskContext.Provider>
    );
};
