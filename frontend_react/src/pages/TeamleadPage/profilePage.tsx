import { useState } from 'react';
import './styles/device-group.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';

interface Operator {
    id: number;
    name: string;
    email: string;
    profiles: string[];
}

interface ProfileOperator {
    profileName: string;
    operators: string[];
}

const ProfilePage = () => {
    const [operators, setOperators] = useState<Operator[]>([
        { id: 1, name: 'Operator 1', email: 'operator1@example.com', profiles: ['Profile 1', 'Profile 2', 'Profile 3'] },
        { id: 2, name: 'Operator 2', email: 'operator2@example.com', profiles: ['Profile 1', 'Profile 2'] },
    ]);

    const profileOperators: ProfileOperator[] = [
        { profileName: 'Profile 3', operators: ['Operator 1', 'Operator 2', 'Operator 3'] },
    ];

    return (
        <div className="profile-container">
            <h1 className="profile-header">Profile Page</h1>

            {/* Bảng đầu tiên */}
            <table className="profile-table">
                <thead>
                    <tr>
                        <th>Tên Operator</th>
                        <th>Email</th>
                        <th>Tên Profile</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {operators.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="no-data">Hiện chưa có lệnh nào</td>
                        </tr>
                    ) : (
                        operators.map((operator) => (
                            <tr key={operator.id}>
                                <td>{operator.name}</td>
                                <td>{operator.email}</td>
                                <td>
                                    {operator.profiles.map((profile, index) => (
                                        <div key={index}>{profile}</div>
                                    ))}
                                </td>
                                <td className="action-cell">
                                    <FontAwesomeIcon
                                        icon={faUserPlus}
                                        title="Gán vào Profile"
                                        className="assign-icon"
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {/* Bảng thứ hai */}
            <table className="profile-table">
                <thead>
                    <tr>
                        <th>Tên Profile</th>
                        <th>Tên Operator</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {profileOperators.length === 0 ? (
                        <tr>
                            <td colSpan={3} className="no-data">Hiện chưa có dữ liệu</td>
                        </tr>
                    ) : (
                        profileOperators.map((profile) => (
                            <tr key={profile.profileName}>
                                <td>{profile.profileName}</td>
                                <td>
                                    {profile.operators.map((operator, index) => (
                                        <div key={index}>{operator}</div>
                                    ))}
                                </td>
                                <td className="action-cell">
                                    <FontAwesomeIcon
                                        icon={faUserPlus}
                                        title="Gán vào Operator"
                                        className="assign-icon"
                                    />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ProfilePage;
