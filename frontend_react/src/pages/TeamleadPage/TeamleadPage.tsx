import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";

const TeamleadPage:React.FC = () => {
    return (
        <Layout>
            <Outlet/>
        </Layout>
    );
}

export default TeamleadPage;