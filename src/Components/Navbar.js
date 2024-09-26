import React, { useState, useRef, useEffect } from "react";

const Navbar = ({ grouping: propGrouping, setGrouping, ordering: propOrdering, setOrdering, call }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const savedGrouping = localStorage.getItem("grouping") || propGrouping;
  const savedOrdering = localStorage.getItem("ordering") || propOrdering;

  const [grouping, setLocalGrouping] = useState(savedGrouping);
  const [ordering, setLocalOrdering] = useState(savedOrdering);

  useEffect(() => {
    localStorage.setItem("grouping", grouping);
    setGrouping(grouping);
  }, [grouping]);

  useEffect(() => {
    localStorage.setItem("ordering", ordering);
    setOrdering(ordering);
  }, [ordering]);

  const handleGroupingChange = (e) => {
    const newGrouping = e.target.value;
    localStorage.setItem("grouping", newGrouping);
    setGrouping(newGrouping);
    if (newGrouping === "users") {
      call();
    }
  };

  const handleOrderingChange = (e) => {
    const newOrdering = e.target.value;
    localStorage.setItem("ordering", newOrdering);
    setOrdering(newOrdering);
  };

  useEffect(() => {
    const detectOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", detectOutsideClick);

    return () => {
      document.removeEventListener("mousedown", detectOutsideClick);
    };
  }, []);

  return (
    <div className="Navbar">
      <div className="dropdown-container" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
          <i className="bx bx-slider"></i>
          <div className="btn-txt">Display</div>
          <i className="bx bx-chevron-down"></i>
        </button>
        {isOpen && (
          <div className="dropdown-content">
            <div className="Grouping">
              <label>Grouping</label>
              <select className='select2' value={propGrouping} onChange={handleGroupingChange}>
                <option className='select' value="status">Status</option>
                <option className='select2' value="users">User</option>
                <option className='select2' value="priority">Priority</option>
              </select>
            </div>
            <div className="Ordering">
              <label>Ordering</label>
              <select className='select2' value={propOrdering} onChange={handleOrderingChange}>
                <option className='select3' value="priority">Priority</option>
                <option className='select2' value="title">Title</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
