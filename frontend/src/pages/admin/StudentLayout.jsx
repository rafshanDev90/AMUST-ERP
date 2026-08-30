import { NavLink, Outlet, useParams } from "react-router-dom";

const StudentLayout = () => {
  const { id } = useParams();

  return (
    <div>
      <nav>
        <NavLink to={`/admin/students/${id}/overview`}>Overview</NavLink>
        <NavLink to={`/admin/students/${id}/fees`}>Fees</NavLink>
        <NavLink to={`/admin/students/${id}/report`}>Report</NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default StudentLayout;
