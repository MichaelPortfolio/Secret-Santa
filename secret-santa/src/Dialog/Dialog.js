import React, { Component } from "react";
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from "axios";

export default class FormDialog extends Component {
	constructor(props){
		super(props);
		this.state = {open: false, message:""};
		this.groupName = "null";
		this.dropSuggest = ["one", "two", "three","four"];
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleTyping = e =>{
		var inputValue = e.target.value;
		const arrPos = parseInt(e.target.id);
		this.props.elemList[arrPos].writeTo = inputValue;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.openDialog !== this.state.open) {
			this.setState({ open: nextProps.openDialog });
		}
		if (nextProps.user !== this.state.user) {
			this.setState({ user: nextProps.user });
		}
	}

	createInput = () => {
		var textFields = [];
		const {elemList} = this.props;
		for(var i =0; i < elemList.length; ++i){
			var textF = <TextField
				autoFocus
				margin="dense"
				key = {i.toString()}
				id={i.toString()}
				label={elemList[i].label}
				type={elemList[i].type}
				fullWidth
				onChange = {this.handleTyping}
			/>
			textFields.push(textF);
		}
		return textFields;
	}

	render() {
	return (
		<div>
		<Dialog
			open={this.state.open}
			onClose={this.handleClose}
			aria-labelledby="form-dialog-title"
		>
			<DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
			<DialogContent>
			<DialogContentText>
				{this.state.message}
			</DialogContentText>
				{this.createInput()}
			</DialogContent>
			<DialogActions>
			<Button onClick={this.handleClose} color="primary">
				Cancel
			</Button>
			<Button onClick={this.props.btnAction} color="primary">
				{this.props.btnName}
			</Button>
			</DialogActions>
		</Dialog>
		</div>
	);
	}
}