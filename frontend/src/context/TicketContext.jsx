import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const TicketContext = createContext();

// Provider component
export function TicketProvider({ children }) {
  const [tickets, setTickets] = useState([
    //empty array (initial tickets)
  ]);

  // Example: simulate fetching tickets on mount
  useEffect(() => {
    // In a real app, replace this with an API call
    const fakeTickets = [
      {
        id: '001',
        subject: 'Login issue',
        status: 'Open',
        priority: 'High',
        createdDate: new Date().toISOString(),
      },
      {
        id: '002',
        subject: 'Cannot access files',
        status: 'In Progress',
        priority: 'Medium',
        createdDate: new Date().toISOString(),
      },
    ];
    setTickets(fakeTickets);
  }, []);

  // You can add more actions like addTicket, updateTicket, deleteTicket here
  const addTicket = (ticket) => {
    setTickets((prev) => [...prev, ticket]);
  };

  const value = {
    tickets,
    setTickets,
    addTicket,
  };

  return (
    <TicketContext.Provider value={value}>
      {children}
    </TicketContext.Provider>
  );
}

// Hook to use ticket context
export function useTickets() {
  const context = useContext(TicketContext);
  if (!context) {
    throw new Error('useTickets must be used within a TicketProvider');
  }
  return context;
}
