import React from "react";
import Layout from "./components/Layout";
import { Outlet } from "react-router-dom";


const AdminPage: React.FC = () => {

    

    return (
        <Layout>
            <Outlet/>
        </Layout>
    );
}

export default AdminPage;