import React, { useState, useEffect } from "react";
import Moment from 'react-moment';
import API from "../../utils/API";
import "./style.css"

function ProjectCard() {
    const [projects, setProjects] = useState([]);
    const [contributors, setContributors] = useState([]);
    let contributorsInfo = [];


    // Load all projects and store them with setProjects
    useEffect(() => {
        loadProjects()
    }, [])

    // Loads all projects and sets them to projects
    function loadProjects() {
        API.getProjects()
            .then(res => {

                setProjects(res.data);
                res.data.map(project => {
                    let contributorsIds = project.Contributors.join('&');
                    API.getContributors(contributorsIds)
                        .then(res => {
                            // contributorsInfo.push(res.data);
                            // setContributors(contributorsInfo);
                            setContributors(prevArray => [...prevArray, res.data]);
                            // console.log(contributors)
                        })
                        .catch(err => console.log(err));
                })
                console.log(contributors)
                // console.log(contributorsInfo);
                // setContributors(contributorsInfo);
            }
            )
            .catch(err => console.log(err));
    };
    const onClickBtn = (project, status) => {
        project.status = status;
        API.updateProject(project._id, project)
            .then(response => {
                loadProjects()
            })
            .catch(e => {
                console.log(e);
            })
    }

    const deleteProject = (id) => {
        API.deleteProject(id)
            .then(res => loadProjects())
            .catch(err => console.log(err));
    }
    return (
        <div className='container'>
            { projects.length ? (
                <div className='row'>
                    {projects.map(project => {
                        return (
                            localStorage.getItem('userId') == project.userId ? (
                                <div className="col-md-4 justify-content-center mb-3" key={project._id}>
                                    <div className="card">
                                        <div className="card-header p-2 pb-0">
                                            <h5 className="card-title text-center">{project.name}</h5>
                                        </div>
                                        <div className="card-body p-0 text-center">
                                            <ul className="list-group list-group-flush">
                                                <li className="list-group-item">Status :
                                                <button className={`btn btn-sm ms-3 ${project.status ? 'btn-success' : 'btn-outline-success'}`} onClick={() => { onClickBtn(project, true) }}>Ongoing</button>
                                                    <button className={`btn btn-sm ms-2 ${!project.status ? 'btn-danger' : 'btn-outline-danger'}`} onClick={() => { onClickBtn(project, false) }}>Closed</button>
                                                </li>
                                                <li className="list-group-item">Start Date : <Moment format="YYYY/MM/DD">{project.startDate}</Moment> </li>
                                                <li className="list-group-item">Location : {project.latitude} , {project.longitude}</li>
                                                <li className="list-group-item">Contributors :
                                            {/* <div className="list-group mt-2">
                                                        {
                                                            contributors.map(contributor => {
                                                                console.log(contributors);
                                                                return (
                                                                    contributor.map(contributor => {
                                                                        return (
                                                                            <button type="button" className="list-group-item list-group-item-action" data-bs-toggle="modal" data-bs-target="#cntModal" key={contributor._id}>{contributor.username}</button>
                                                                        )
                                                                    })
                                                                )
                                                            })}
                                                    </div> */}
                                                    {/* Contributor Modal
                                                {/* <div className="modal fade" id="cntModal" tabIndex="-1" aria-labelledby="contributorModal" aria-hidden="true">
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5 className="modal-title" id="contributorModal">{project.Contributors[0]}</h5>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                                            </div>
                                                            <div className="modal-body">
                                                                Do you want to delete {project.ContributorNames[0]} from the project?
                                                    </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                                                <button type="button" className="btn btn-danger">Delete</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}

                                                </li>
                                                <li className="list-group-item">End Date : <Moment format="YYYY/MM/DD">{project.endDate}</Moment></li>
                                            </ul>
                                        </div>
                                        <div className="card-footer text-center">
                                            <button type="button" className="btn btn-sm btn-danger"
                                                onClick={() => {
                                                    deleteProject(project._id);
                                                }}>Delete</button>
                                        </div>
                                    </div>

                                </div>
                            ) : null
                        );
                    })
                    }
                </div>

            ) : (
                <h3 className="text-center m-3 p-2">No Results to Display</h3>

            )}
        </div>
    )
};


export default ProjectCard;