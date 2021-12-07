import React, { Component } from 'react';
import Navbar from "./other/Navbar";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from "./Home";
import AddFilm from './other/AddFilm';
import Films from './components/Film/Films';
import FilmClass from "./class/FilmClass";
import { NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import nextId from "react-id-generator";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import AddRoom from './other/AddRoom';
import Rooms from './components/Room/Rooms';
import RoomClass from "./class/RoomClass";
import * as FilmsApi from './api/FilmsApi';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filmList: [
            //  new FilmClass(parseInt(nextId().slice(2)),  "Venom",  240 ),
            //  new FilmClass( parseInt(nextId().slice(2)),  "Atak Ludzi Grzybów",  90 ),
            //   new FilmClass( parseInt(nextId().slice(2)),  "Hannibal",  131 ),
            //   new FilmClass( parseInt(nextId().slice(2)),  "Smakosz",  90 ),
            ],
            roomList: [
              new RoomClass(parseInt(nextId().slice(2)),  30,  24 ),
              new RoomClass( parseInt(nextId().slice(2)),  32,  9 ),
               new RoomClass( parseInt(nextId().slice(2)),  33,  13 ),
               new RoomClass( parseInt(nextId().slice(2)),  34,  9 ),
             ],
          };
        }
        
        createNotification(message, type) {
          switch (type) {
            case "SUCCESS":
              NotificationManager.success('Success', message);
              break;
            case "ERROR":
              NotificationManager.error('Error', message);
              break;
            default:
              break;
          }
        }

          addZero(number) {
            return number < 10 ? '0' + number : number;
        }
        
        
          onChange(e) {
            var name = e.target.id;
            this.setState({
              [name]: e.target.value
            });
          }
        
          changeTable() {
            this.setState(state => {
              let show = state.showFilms
              return { showFilms: !show }
            });
          }
          
          // addFilm = (s) => {
          //   this.setState(state => {
          //     var films = state.filmList;
          //     var id = parseInt(nextId().slice(2))
          //     let newFilm = new FilmClass(id, s.title, s.duration);
          //     films.push(newFilm);
          //     return { filmList: films }
          //   });
          // }
          addFilm = (s) => {
            //var date = s.date === undefined ? null : s.date;
           // var time = s.time === undefined ? null : s.time;
            var status = "";
            //var category = s.category.replace(/ +/g, "");
            //if (category.toUpperCase() === "TODO") {
              //status = false;
              //category = "To do";
            //}
            //else
              //category = s.category
        
            var body = {
              title: s.title,
              duration: s.duration
              
            }
        
           //var message = this.validateAddForm(body);
            //if (message.length === 0) {
              FilmsApi.addFilm(body)
                .then(response => {
                  if (response.status === 201) {
                    this.createNotification("Note was added succesfully", "SUCCESS");
                    this.updateNotesList("PUSH", body);
                  }
                });
            //} else {
              //for (let i = 0; i < message.length; i++)
              //  this.createNotification(message[i], "ERROR");
            //}
          }
          editFilm = (film, s) => {

            var body = {
              //id: id,
              title: s.title,
              duration: s.duration
              
            }
        
            var messages = this.validateEditForm(body);
            if (messages.length === 0) {
              FilmsApi.editFilm(film.filmId, body)
                .then(response => {
                  if (response.status === 200) {
                    this.createNotification('Note was edited successfully', "SUCCESS");
                    this.updateNotesList("PUT", body);
                  }
                });
            } else {
              for (let i = 0; i < messages.length; i++)
                this.createNotification(messages[i], "ERROR");
            }
          }
        
          deleteFilm = (id) => {
            FilmsApi.deleteFilm(id)
              .then(response => {
                if (response.status === 204) {
                  this.createNotification('Note was removed succesfully', "SUCCESS");
                  this.updateFilmList("DELETE", id)
                }
              });
          }

          addZero(number) {
              return number < 10 ? '0' + number:number;
          }

          addRoom = (s) => {
            this.setState(state => {
              var rooms = state.roomList;
              var id = state.roomList.length + 1;
              let newRoom = new RoomClass(id, s.space, s.spaceLeft);
              rooms.push(newRoom);
              return { RoomList: Rooms }
            });
          }
        
          editRoom = (index, s) => {
            this.setState(state => {
              var rooms = state.roomList;
              rooms[index].space = s.editSpace;
              rooms[index].spaceLeft = s.editSpaceLeft;
        
              return { roomList: rooms }
            });
            this.createNotification('Room was edited successfully');
          }
        
          deleteRoom = (index) => {
            this.setState(state => {
              var rooms = state.roomList;
              rooms.splice(index, 1);
              return { roomList: rooms }
            });
          }

        render() {
                const { filmList,roomList } = this.state;
                return (
                    <Router>
                        <Navbar />
                        <Route exact path="/"
                            render={() => <Home filmList={filmList}
                            addZero={this.addZero}
                                 />} />
                        <Route path="/allFilms"
                            render={() => <Films filmList={filmList}
                                deleteFilm={this.deleteFilm}
                                editFilm={this.editFilm}
                                addZero={this.addZero}
                         />} />

                          <Route path="/allRooms"
                            render={() => <Rooms roomList={roomList}
                                deleteRoom={this.deleteRoom}
                                editRoom={this.editRoom}
                                addZero={this.addZero}
                         />} />
                        <Route path="/addFilm"
                            render={() => <AddFilm addFilm={this.addFilm} />} />

                         <Route path="/addRoom"
                            render={() => <AddRoom addRoom={this.addRoom} />} />  

                        {/* <Route path="/calendar"
                            render={() => <Calendar noteList={noteList}
                addZero={this.addZero} />} />   dodac tu pozniej repertuary */ }
                    </Router>
                );
            }
        }
export default App;