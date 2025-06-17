import { createContext, useContext, useState, useEffect } from 'react';

const BugContext = createContext();

const initialBugs = [
  {
    id: 1,
    title: 'Login page not responsive',
    description: 'The login page breaks on mobile devices',
    priority: 'high',
    status: 'open',
    assignee: 'John Developer',
    createdDate: '2023-05-01',
    dueDate: '2023-05-10',
    timeSpent: 2.5,
    createdBy: 'Jane Manager'
  },
  {
    id: 2,
    title: 'Dashboard loading slowly',
    description: 'Dashboard takes more than 5 seconds to load',
    priority: 'medium',
    status: 'in-progress',
    assignee: 'John Developer',
    createdDate: '2023-05-02',
    dueDate: '2023-05-15',
    timeSpent: 1.0,
    createdBy: 'Jane Manager'
  },
  {
    id: 3,
    title: 'API endpoint failing',
    description: '/api/users returns 500 error',
    priority: 'critical',
    status: 'pending-approval',
    assignee: 'John Developer',
    createdDate: '2023-04-28',
    dueDate: '2023-05-05',
    timeSpent: 4.0,
    createdBy: 'Jane Manager'
  }
];

export function BugProvider({ children }) {
  const [bugs, setBugs] = useState(() => {
    const savedBugs = localStorage.getItem('bugs');
    return savedBugs ? JSON.parse(savedBugs) : initialBugs;
  });
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeEntries, setTimeEntries] = useState([]);

  useEffect(() => {
    localStorage.setItem('bugs', JSON.stringify(bugs));
  }, [bugs]);

  const addBug = (bug) => {
    const newBug = {
      ...bug,
      id: Date.now(),
      createdDate: new Date().toISOString().split('T')[0],
      status: 'open',
      timeSpent: 0
    };
    setBugs([...bugs, newBug]);
  };

  const updateBug = (id, updates) => {
    setBugs(bugs.map(bug => bug.id === id ? { ...bug, ...updates } : bug));
  };

  const deleteBug = (id) => {
    setBugs(bugs.filter(bug => bug.id !== id));
  };

  const startTimer = (bugId) => {
    if (activeTimer) {
      stopTimer(activeTimer.bugId);
    }
    
    const startTime = new Date();
    setActiveTimer({ bugId, startTime });
    
    return startTime;
  };

  const stopTimer = (bugId) => {
    if (!activeTimer || activeTimer.bugId !== bugId) return;
    
    const endTime = new Date();
    const timeSpent = (endTime - activeTimer.startTime) / (1000 * 60 * 60); // in hours
    
    setBugs(bugs.map(bug => 
      bug.id === bugId ? { ...bug, timeSpent: bug.timeSpent + timeSpent } : bug
    ));
    
    setTimeEntries([
      ...timeEntries,
      {
        bugId,
        startTime: activeTimer.startTime,
        endTime,
        duration: timeSpent
      }
    ]);
    
    setActiveTimer(null);
    return timeSpent;
  };

  return (
    <BugContext.Provider value={{ 
      bugs, 
      addBug, 
      updateBug, 
      deleteBug, 
      activeTimer, 
      startTimer, 
      stopTimer,
      timeEntries
    }}>
      {children}
    </BugContext.Provider>
  );
}

export function useBugs() {
  return useContext(BugContext);
}