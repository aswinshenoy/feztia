import React, { useState } from 'react';
import ViewAuthenticator from "../src/components/shared/ViewAuthenticator";
import Base from "../src/components/shared/Base";
import Header from "../src/components/shared/Header";
import AdminPanel from "../src/components/admin";
import RegistrationForm from "../src/components/registration/RegisterForm";
import CreateTeam from "../src/components/teams/CreateTeam";

const CreateTeamPage = () => {

    return <ViewAuthenticator
        renderAdmin={() =>
            <Base meta={{ title: 'Admin Panel' }}>
                <Header />
                <div className="container-lg px-2 py-5">
                    <AdminPanel />
                </div>
            </Base>
        }
        renderAuth={() =>
            <Base meta={{ title: 'Create A Team' }}>
                <Header />
                <div className="container my-3">
                    <nav aria-label="breadcrumb">
                        <ol className="mb-3 breadcrumb bg-white shadow-sm">
                            <li className="breadcrumb-item"><a href="/">Dashboard</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Create A Team</li>
                        </ol>
                    </nav>
                    <CreateTeam showContinue={false} />
                </div>
            </Base>
        }
        renderPublic={() =>
            <Base meta={{ title: 'Registration' }}>
                <RegistrationForm />
            </Base>
        }
    />;

};

export default CreateTeamPage;