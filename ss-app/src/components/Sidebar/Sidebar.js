import React, { useState } from "react";
import "./Sidebar.css";
import ListGroup from "react-bootstrap/ListGroup";
import ListItem from "../SimpleComponents/ListItem";
import Button from "react-bootstrap/Button";
import ModalContainer from "../../containers/ModalContainer";

const SideBar = ({ groups, selectGroup, errorMsg, showSidebar, user }) => {
	const [modalShow, setModalShow] = useState(false);
	return (
		<div className={"sidebar " + showSidebar}>
			{user && <span className="username">{user.nickname}</span>}
			<div className="sidebar-header">
				<h3>My Groups</h3>
			</div>

			<ListGroup>
				{groups.map((group, index) => (
					<ListItem
						key={index}
						group={group}
						selectGroup={(group) => selectGroup(group)}
					/>
				))}
			</ListGroup>
			<Button
				variant="outline-primary"
				className="add-group-btn"
				onClick={() => {
					setModalShow(true);
				}}
			>
				Add Group
			</Button>
			<span className="error">{errorMsg}</span>
			{modalShow && (
				<ModalContainer
					show={modalShow}
					onHide={() => setModalShow(false)}
					ugid={null}
					currData={{}}
					heading={"Add New Group"}
					modalType={"add-group"}
				/>
			)}
		</div>
	);
};

export default SideBar;
