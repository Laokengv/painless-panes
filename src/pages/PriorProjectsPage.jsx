import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import FormPageHeader from "../components/FormPageHeader";
import actions from "../store/actions";

export default function PriorProjectsPage() {
  const userProjects = useSelector((store) => store.projects);
  const projectWindows = useSelector((store) => store.allWindows);
  console.log(projectWindows);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getAllProjects());
    dispatch(actions.getAllWindows({ project_id: userProjects.user_id }));
  }, []);

  // add zipcode and date

  return (
    <>
      <FormPageHeader text="My Projects" />
      <div className="overflow-x-auto">
        {projectWindows.map((project) => {
          <div key={project.id} className="card w-96 bg-base-100 shadow-xl">
            <figure>
              <img src={project.image} />
            </figure>
            <div className="card-body">
              <p>{project.height}</p>
              <p>{project.width}</p>
              <p>{project.desired_frame_id}</p>
              {project.submissionDate && (
                <p>
                  Submission Date:
                  {new Date(project.submissionDate).toLocaleString()}
                </p>
              )}
            </div>
          </div>;
        })}
      </div>
    </>
  );
}
