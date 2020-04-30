import {
	UPDATE_PERSON,
	UPDATE_PERSON_ERROR,
	ADD_PERSON,
	DELETE_PERSON,
	ADD_GROUP,
	UPDATE_GROUP,
	DELETE_GROUP,
} from "./types";
import { loadSelectedGroup, clearSelectedGroup } from "../ActiveGroup/actions";
import {
	loadGroupList,
	loadGroupsError,
	doSelectGroup,
} from "../Sidebar/actions";
import { do_post, do_put, do_delete } from "../api/actions";

const endpoint = "http://localhost:8080/";

const updatePersonStore = (person) => ({
	type: UPDATE_PERSON,
	data: person,
});

const updatePersonError = (message) => ({
	type: UPDATE_PERSON_ERROR,
	data: message,
});

export const doTestExport = (group_name, group_id) => {
	return { type: "DO_TEST", data: { group_name, group_id } };
};

export const updatePerson = (n_person) => async (dispatch) => {
	const { name, email, person_id } = n_person;
	let response = await do_put(endpoint + "updateperson", {
		name,
		email,
		person_id,
	});
	if (response.status === 200) {
		dispatch(updatePersonStore(n_person));
	} else {
		dispatch(updatePersonError(response));
	}
	return {
		type: ADD_PERSON,
	};
};

export const addPerson = ({ name, email }, group_id = 4) => async (
	dispatch
) => {
	let response = await do_post(endpoint + "addperson", {
		name,
		email,
		group_id,
	});
	if (response.status === 200) {
		dispatch(loadSelectedGroup(group_id));
	} else {
		dispatch(updatePersonError(response));
	}
	return {
		type: ADD_PERSON,
	};
};

export const deletePerson = ({ person_id }, group_id) => async (dispatch) => {
	let response = await do_delete(endpoint + "deleteperson?id=" + person_id);
	if (response.status === 200) {
		dispatch(loadSelectedGroup(group_id));
	} else {
		dispatch(updatePersonError(response));
	}
	return {
		type: DELETE_PERSON,
	};
};

export const addGroup = ({ group_name }) => async (dispatch) => {
	let response = await do_post(endpoint + "creategroup", { group_name });
	if (response.status === 200) {
		dispatch(loadGroupList());
	} else {
		dispatch(loadGroupsError(response));
	}
	return {
		type: ADD_GROUP,
	};
};

export const updateGroup = ({ group_name }, group_id) => async (dispatch) => {
	let response = await do_put(endpoint + "updategroup", {
		group_name,
		group_id,
	});
	if (response.status === 200) {
		dispatch(loadGroupList()).then(dispatch(loadSelectedGroup(group_id)));
	} else {
		dispatch(loadGroupsError(response));
	}
	return {
		type: UPDATE_GROUP,
	};
};

export const deleteGroup = (group_id) => async (dispatch) => {
	console.log("group_id", group_id);
	let response = await do_delete(
		endpoint + "deletegroup?group_id=" + group_id
	);
	if (response.status === 200) {
		dispatch(loadGroupList());
		dispatch(doSelectGroup({}));
		dispatch(clearSelectedGroup());
	} else {
		dispatch(loadGroupsError(response));
	}
	return {
		type: DELETE_GROUP,
	};
};
