import React, { useEffect, useState } from "react";
import Card from "../Components/Card";
import Navbar from "../Components/Navbar";
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile.png";
import profile4 from "../Assets/profile.png";
import profile5 from "../Assets/profile.png";
import profile6 from "../Assets/profile.png";
import profile7 from "../Assets/profile.png";
import high from "../Assets/Img - High Priority.svg";
import low from "../Assets/Img - Low Priority.svg";
import medium from "../Assets/Img - Medium Priority.svg";
import add from "../Assets/add.svg"
import dot from "../Assets/dot.svg"
import Todo from "../Assets/To-do.svg";
import Backlog from "../Assets/Backlog.svg";
import urgent from "../Assets/SVG - Urgent Priority colour.svg";
import progress from "../Assets/in-progress.svg";
import done from "../Assets/Done.svg";
import cancelled from "../Assets/Cancelled.svg";
import no from "../Assets/No-priority.svg";

const Dashboard = () => {
  const [userData, setUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState({});
  const [user, setUser] = useState({});
  const [priority, setPriority] = useState({});
  const [grouping, setGrouping] = useState('status');
  const [ordering, setOrdering] = useState('priority');
  const [availableUser, setAvailableUser] = useState({});
  const [statusMapping, setStatusMapping] = useState({});
  
  const statusKeys = ["Backlog", "Todo", "In progress", "Done", "Canceled"];

  useEffect(() => {
    fetchData();
  }, [grouping, ordering]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://api.quicksell.co/v1/internal/frontend-assignment");
      const data = await response.json();
      setIsLoading(false);
      setUserData(data.users);
      setUser(groupByUser(data.tickets));
      setStatus(groupByStatus(data.tickets));
      setPriority(groupByPriority(data.tickets));
      setAvailableUser(mapUserAvailability(data.users));
      setStatusMapping(extractStatusMappings(data));
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const sortTicketsByTitle = (tickets) => {
    return tickets.sort((a, b) => a.title.localeCompare(b.title));
  };

  const groupByStatus = (tickets) => {
    let organizedTickets = tickets;

    if (ordering === "title") {
      organizedTickets = sortTicketsByTitle(tickets);
    }

    const groupedTickets = organizedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.status]) {
        acc[ticket.status] = [];
      }
      acc[ticket.status].push(ticket);
      return acc;
    }, {});

    statusKeys.forEach((key) => {
      if (!groupedTickets[key]) {
        groupedTickets[key] = [];
      }
    });

    if (ordering === "priority") {
      Object.keys(groupedTickets).forEach((key) => {
        groupedTickets[key].sort((a, b) => b.priority - a.priority);
      });
    }

    return { Keys: statusKeys, ...groupedTickets };
  };

  const groupByPriority = (tickets) => {
    let organizedTickets = tickets;

    if (ordering === "title") {
      organizedTickets = sortTicketsByTitle(tickets);
    }

    const priorityGrouped = organizedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.priority]) {
        acc[ticket.priority] = [];
      }
      acc[ticket.priority].push(ticket);
      return acc;
    }, {});

    return { Keys: Object.keys(priorityGrouped), ...priorityGrouped };
  };

  const groupByUser = (tickets) => {
    let organizedTickets = tickets;

    if (ordering === "title") {
      organizedTickets = sortTicketsByTitle(tickets);
    }

    const userGrouped = organizedTickets.reduce((acc, ticket) => {
      if (!acc[ticket.userId]) {
        acc[ticket.userId] = [];
      }
      acc[ticket.userId].push(ticket);
      return acc;
    }, {});

    if (ordering === "priority") {
      Object.keys(userGrouped).forEach((key) => {
        userGrouped[key].sort((a, b) => b.priority - a.priority);
      });
    }

    return { Keys: userData.map((user) => user.id.toString()), ...userGrouped };
  };

  const mapUserAvailability = (users) => {
    return users.reduce((acc, user) => {
      acc[user.id] = user.available;
      return acc;
    }, {});
  };

  const extractStatusMappings = (data) => {
    const mappings = {};
    data.tickets.forEach((ticket) => {
      mappings[ticket.id] = ticket.status;
    });
    return mappings;
  };

  return (
    <div>
      <Navbar
        grouping={grouping}
        setGrouping={setGrouping}
        ordering={ordering}
        setOrdering={setOrdering}
        call={fetchData}
      />
      <div className="Dashboard-Container">
        {isLoading ? (
          <div></div>
        ) : grouping === "status" ? (
          status.Keys.map((item, index) => (
            <div className="column" key={index}>
              <div className="Header">
                <div className="icon-text">
                  <i>
                    <img
                      src={
                        item === "Todo"
                          ? Todo
                          : item === "In progress"
                          ? progress
                          : item === "Backlog"
                          ? Backlog
                          : item === "Done"
                          ? done
                          : cancelled
                      }
                      alt="status"
                    />
                  </i>
                  <span className="text">
                    {item === "In progress" ? "In Progress" : item}
                  </span>
                  <span>{status[item]?.length}</span>
                </div>
                <div className="actions">
                  <i className="bx bx-plus" id="plus"></i>
                  <i className="bx bx-dots-horizontal-rounded" id="dots"></i>
                </div>
              </div>
              {status[item]?.map((value) => (
                <Card
                  key={value.id}
                  {...value}
                  userData={userData}
                  status={status}
                  grouping={grouping}
                  ordering={ordering}
                  statusMapping={statusMapping}
                />
              ))}
            </div>
          ))
        ) : grouping === "users" ? (
          user.Keys.map((userId, index) => {
            const currentUser = userData.find((u) => u.id.toString() === userId) || {};
            return (
              <div className="column" key={index}>
                <div className="Header">
                  <div className="icon-text">
                    <div className={availableUser[userId] ? "user-avatar" : "user-avatar-unavailable"}>
                      <img
                        src={
                          userId === "usr-1"
                            ? profile1
                            : userId === "usr-2"
                            ? profile6
                            : userId === "usr-3"
                            ? profile7
                            : userId === "usr-4"
                            ? profile5
                            : userId === "usr-5"
                            ? profile4
                            : profile
                        }
                        alt="user"
                        height="20px"
                        width="auto"
                      />
                    </div>
                    <span className="text">{currentUser.name || "Unknown"}</span>
                    <span>{user[userId]?.length}</span>
                  </div>
                  <div className="actions">
                    <i className="bx bx-plus" id="plus"></i>
                    <i className="bx bx-dots-horizontal-rounded" id="dots"></i>
                  </div>
                </div>
                {user[userId]?.map((ticket) => (
                  <Card
                    key={ticket.id}
                    {...ticket}
                    userData={userData}
                    status={status}
                    statusMapping={statusMapping}
                    grouping={grouping}
                    ordering={ordering}
                  />
                ))}
              </div>
            );
          })
        ) : (
          priority.Keys.sort((a, b) => a - b).map((item, index) => (
            <div className="column" key={index}>
              <div className="Header">
                <div className="icon-text-priority">
                  <i>
                    <img
                      src={
                        item === "0"
                          ? no
                          : item === "1"
                          ? low
                          : item === "2"
                          ? medium
                          : item === "3"
                          ? high
                          : urgent
                      }
                      alt="priority"
                    />
                  </i>
                  <span className="text">
                    {item === "4"
                      ? "Urgent"
                      : item === "3"
                      ? "High"
                      : item === "2"
                      ? "Medium"
                      : item === "1"
                      ? "Low"
                      : "No Priority"}
                  </span>
                  <span className="count">{priority[item]?.length}</span>
                </div>
                <div className="actions">
                  <i><img src={add}/></i>
                  <i><img src={dot}/></i>
                </div>
              </div>
              {priority[item]?.map((ticket) => (
                <Card
                  key={ticket.id}
                  {...ticket}
                  userData={userData}
                  status={status}
                  grouping={grouping}
                  ordering={ordering}
                  statusMapping={statusMapping}
                />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
