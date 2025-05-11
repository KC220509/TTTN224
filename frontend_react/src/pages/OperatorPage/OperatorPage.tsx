import { Outlet } from "react-router-dom";
import Layout from "../components/Layout";

const OperatorPage:React.FC = () => {
    return (
        <Layout>
            <Outlet/>
        </Layout>
    );
}

export default OperatorPage;