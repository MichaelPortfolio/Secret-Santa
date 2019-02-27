import React, { Component } from "react";
import "../App.css";
import Button from '@material-ui/core/Button';
import axios from "axios";
import Dialog from "../Dialog/Dialog.js"
import Dropdown from '../Dropdown/Dropdown.js';


const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

export default class GroupDetails extends Component {
	constructor(props) {
		super(props);
		this.state = {groups: this.props.groups, activeGroup: null, changeAllowed:true, user: this.props.user,
		people :[], notListDialogOpen: false};
		this.people =[];
		this.dialog = [
			{"type":"textSuggest", "label":"Not person 1:", "writeTo": "", "suggestions": this.people,"suggestion_show": "name"},
			{"type":"textSuggest", "label":"Not person 2:", "writeTo": "", "suggestions": this.people,"suggestion_show": "name"},
			{"type":"textSuggest", "label":"Not person 3:", "writeTo": "", "suggestions": this.people,"suggestion_show": "name"},
			{"type":"textSuggest", "label":"Not person 4:", "writeTo": "", "suggestions": this.people,"suggestion_show": "name"},
		];
	}

	handleChange = event => {
		event.target.className = "unsaved";
		console.log(event.target);
		//*****Should add a color to say changed/unsaved ******
		//clearTimeout(this.timer);
		//this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
		/*this.setState({
			[event.target.type]: event.target.value
		});*/
	}

	handleKeyDown = e => {
		if (e.keyCode === ENTER_KEY) {
			var parts = e.target.title.split("-");
			//clearTimeout(this.timer);
			this.triggerChange(e.target.value, parts[0],parts[1],parts[2],e.target.id);
		}
	}

	triggerChange = (val, group_id,col,id,elemId) => {
		var authOptions = {
			method: 'put',
			url: 'http://localhost:8080/updateperson',
			headers: {'X-User-ID': this.state.user.uuid,
			'Access-Control-Allow-Origin': '*'},
			data : {
				'group_id':group_id,'id':id,'col': col,'newVal': val
			},
			json: true
		};

		if( id === "new" ||id === "undefined"){
			authOptions.method = "post";
			authOptions.url = 'http://localhost:8080/addperson';
		}

		axios(authOptions)
		.then(res => {
			if(res.status === 200){//updated person
				if(res.data.success){
					console.log(elemId,res.data);
					document.getElementById(elemId).classList.remove("unsaved");
				}
			}
			if(res.status === 202){//added person
				if(res.data.success){
					this.props.updateGroup(res.data.updated_g_id, res.data.updated_group[0]);
					//continue to deal with new group
				}
			}
		})
		.catch(error => {
			console.log(error);
		});
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.groups !== this.state.groups) {
			this.setState({ groups: nextProps.groups });
		}

		this.setState({activeGroup: nextProps.activeGroup }, ()=> this.generatePeople());

		if (nextProps.user !== this.state.user) {
			this.setState({ user: nextProps.user });
		}
	}

	showAlert = (msg) =>{
		alert(msg);
		console.log(this.state.people);
	}

	openDialog = () =>{
		this.setState({ notListDialogOpen : true });
	}

	addPerson = (sing) =>{
		var addDirect = false;
		var single = sing;
		if (single === null){
			single = {"name":"","email":"","person_id":"new"};
			addDirect = true;
		}
		const gid = this.state.activeGroup.group_id;
		var person = <div className="person" key={"person-"+single.person_id}>
				<Button variant="outlined" color="primary"
				onClick={this.showAlert.bind(this,"Are you sure you want to delete: "+single.name)}>-</Button>
				<input type="text" key={"name-"+single.person_id} id={"pname-"+single.person_id} title={gid+"-name-"+single.person_id}
					defaultValue={single.name} onChange ={this.handleChange}  onKeyDown={this.handleKeyDown}/>
				<input type="text" key={"email-"+single.person_id} id={"pemail-"+single.person_id} title={gid+"-email-"+single.person_id}
					defaultValue={single.email} onChange ={this.handleChange}  onKeyDown={this.handleKeyDown}/>
				<Button variant="outlined" color="primary"
				onClick={this.openDialog}>Nots</Button>
			</div>

		if(!addDirect){return person;}
		var newGroup = this.state.activeGroup;
		newGroup.people.push(person);
		this.setState({activeGroup: newGroup});
	}

	generatePeople = () =>{
		var list =[];

		if(typeof this.state.activeGroup !== "object" || this.state.activeGroup === null){
			return [];
		}
		var peopleList = this.state.activeGroup.people;
		for(var i =0; i < peopleList.length;++i){
			var single = peopleList[i];
			list.push(this.addPerson(single));
		}
		this.setState({people: list});
	}

	render() {

		return (
			<div className="Details">
			{this.props.activeGroupId!=="null" ? (
				<>
				<h1>{this.state.activeGroup.group_name}</h1>
				{this.state.people}
				<Button variant="outlined" color="primary"
					onClick={this.addPerson.bind(this,null)}>+</Button>
				</>
			):(
				<p> Nothing to see here</p>
			)}
			{this.state.activeGroup && this.state.notListDialogOpen ?(
				<Dialog user= {this.state.user} openDialog = {this.state.notListDialogOpen} title={"Nots"}
				elemList={{"suggestions": this.state.activeGroup.people,"type": "textSuggest"}} text={this.diText} btnName={"Create"} btnAction={this.createGroup}/>
			):(null)
			}
			</div>
		);
	}
}