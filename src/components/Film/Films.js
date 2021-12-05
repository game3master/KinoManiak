import  React, {Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Film from "./Film";
import { Table, Button } from 'react-bootstrap';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import nextId from "react-id-generator";
import FilmClass from "../../class/FilmClass";
import EditFilmForm from "../../forms/EditFilmForm"
import DeleteFilmForm from "../../forms/DeleteFilmForm"
import AddFilm from  "../../other/AddFilm"
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


class Films extends Component {
 


  createNotification(message) {
    NotificationManager.success('Success', message);
  }

  showDeleteFilmForm = (id) => {
    const { filmList, deleteFilm } = this.props;
    var index = filmList.findIndex(function (value) {
      return value.id === id;
    });

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <DeleteFilmForm index={index} onClose={onClose} deleteFilm={deleteFilm} />
        );
      }
    });
  }

  showEditFilmForm = (id) => {
    const { filmList, editFilm } = this.props;
    var index = filmList.findIndex(function (value) {
      return value.id === id;
    });

    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div>
            <EditFilmForm filmList={filmList} index={index} onClose={onClose} editFilm={editFilm} />
            <NotificationContainer />
          </div>
        );
      }
    });
  }




  render() {
    const { filmList } = this.props;
    return (
      <div className="content">
        <div className="header" >List of films</div>
        <Table striped bordered>
          <thead>
            <tr align ="center">
              <th>id</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
           filmList && filmList.map((film, key) => {
              return (
                <Film
                  key={key}
                  id={film.id}
                  title={film.title}
                  duration={film.duration}
                  showEditFilmForm={this.showEditFilmForm}
                  showDeleteFilmForm={this.showDeleteFilmForm}
                />
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}
export default Films;
