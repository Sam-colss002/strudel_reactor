import { useState, createContext, useContext } from 'react';

const StrudelContext = React.createContext(null);

export default function ContextManager() {
    const value = React.useMemo(() => {
        return {
            testNumber: 10,
            setTestNumber
            //log: (t) => console.log(t)
        }
    }, [testNumber, setTestNumber]);

}

export const ManagerContext = React.createContext(null);