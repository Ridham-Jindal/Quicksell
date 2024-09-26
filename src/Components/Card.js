import React, { useEffect } from "react";
import profile from "../Assets/profile.png";
import profile1 from "../Assets/profile.png";
import profile4 from "../Assets/profile.png";
import profile5 from "../Assets/profile.png";
import profile6 from "../Assets/profile.png";
import profile7 from "../Assets/profile.png";
import high from "../Assets/Img - High Priority.svg";
import low from "../Assets/Img - Low Priority.svg";
import medium from "../Assets/Img - Medium Priority.svg";
import Todo from "../Assets/To-do.svg";
import Backlog from "../Assets/Backlog.svg";
import urgent from "../Assets/SVG - Urgent Priority colour.svg";
import progress from "../Assets/in-progress.svg";
import done from "../Assets/Done.svg";
import cancelled from "../Assets/Cancelled.svg";
import no from "../Assets/No-priority.svg";

const Card = ({
  id,
  title,
  tag,
  userId,
  userData,
  status,
  priority,
  grouping,
  ordering,
  statusMapping,
}) => {
  const user = userData.find((user) => user.id === userId);

  return (
    <div className="card">
      <div className="card-header">
        <div className="status-heading">
          {grouping == "users" || grouping == "priority" ? (
            statusMapping[id] == "Todo" ? (
              <i><img src={Todo}/></i>
            ) : statusMapping[id] == "In progress" ? (
              <i><img src={progress}/></i>
            ) : statusMapping[id] == "Backlog" ? (
              <i><img src={Backlog}/></i>
            ) : statusMapping[id] == "Done" ? (
              <i><img src={done}/></i>
            ) : (
              <i><img src={cancelled}/></i>
            )
          ) : null}
          <p>{id}</p>
        </div>
        {grouping != "users" ? (
          <div
            className={
              user && !user.available
                ? "user-avatar-unavailable"
                : "user-avatar"
            }
          >
            <img
              src={
                userId == "usr-1"
                  ? profile1
                  : userId == "usr-2"
                  ? profile6
                  : userId == "usr-3"
                  ? profile7
                  : userId == "usr-4"
                  ? profile5
                  : userId == "usr-5"
                  ? profile4
                  : profile
              }
              className={
                user && !user.available
                  ? "user-avatar-unavailable"
                  : "user-avatar"
              }
              alt="user"
            ></img>
          </div>
        ) : null}
      </div>
      <div className="card-title">
        <p>{title}</p>
      </div>
      <div className="card-footer">
        {grouping != "priority" ? (
          <div className="feature-container">
            {priority == "0" ? (
              <i><img src={no}/></i>
            ) : priority == "1" ? (
              <i><img src={low}/></i>
            ) : priority == "2" ? (
              <i><img src={medium}/></i>
            ) : priority == "3" ? (
              <i><img src={high}/></i>
            ) : (
              <i><img src={urgent}/></i>
            )}
          </div>
        ) : null}
        {tag?.map((value, index) => {
          return (
            <div className="feature-container" key={index}>
              <div className="alert-icon"></div>
              <div className="feature-request">{value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
