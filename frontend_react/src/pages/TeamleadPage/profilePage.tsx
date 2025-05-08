import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


interface CommandList {
    command_list_id: number;
    name: string;
}

interface DeviceGroup {
    device_group_id: number;
    name: string;
}


interface Operator {
    user_id: number;
    username: string;
  }
  
  interface Profile {
    profile_id: number;
    name: string;
  }
  
  
  

const ProfilePage = () => {
    const location = useLocation();
    const title = location.state?.title || '';

    const [errorGetGroups, setErrorGetGroups] = useState('');


    const [showAddProfile, setShowAddProfile] = useState(false);
    const [showAssignProfile, setShowAssignProfile] = useState(false);

    // Get Data
    const [profileName, setProfileName] = useState('');

    const [commandLists, setCommandLists] = useState<CommandList[]>([]);
    const [commandList, setCommandList] = useState('');
    const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([]);
    const [deviceGroup, setDeviceGroup] = useState('')

    const fetchListCommand = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const resCommandList = await axios.get(`http://localhost:8000/api/teamlead/list-command/${user_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            if(resCommandList.data.success) {
                setCommandLists(resCommandList.data.command_lists);
            }
            else {
                setCommandLists([]);
                alert(resCommandList.data.message);
            }

        } catch (error) {
            console.error("Error fetching command list:", error);
        }
    }

    const fetchListGroup = async () => {
        try{
          const user_id = localStorage.getItem("user_id");
          const resListDevice = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-group/${user_id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          });
    
          if(resListDevice.data.success){
            setDeviceGroups(resListDevice.data.groups);
          }
          else{
            setTimeout(() => {
                setErrorGetGroups(resListDevice.data.message);
            }, 3000);
          }
        }
        catch{
            setTimeout(() => {
                setErrorGetGroups("Lỗi gọi API");
            }, 3000);
        }
    }
      
    useEffect(() => {
        fetchListCommand();
        fetchListGroup();
    },[]);

    //Create Profile

    const hadleAddProfileSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try{
            const resCreateProfile = await axios.post("http://127.0.0.1:8000/api/teamlead/create-profile", {
                name: profileName,
                command_list_id: commandList,
                device_group_id: deviceGroup,
                user_ID: localStorage.getItem('user_id'),
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            });
            if(resCreateProfile.data.success) {
                alert(resCreateProfile.data.message);
                setShowAddProfile(false);
                setProfileName('');
                setCommandList('');
                setDeviceGroup('');
            }
            else {
                alert(resCreateProfile.data.message);
            }

        }
        catch(error) {
            console.error("Error creating profile:", error);
        }
    }



    
    // Assign Profile
    const [isSingleOperatorMode, setIsSingleOperatorMode] = useState<boolean>(true);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    
    const [operatorList, setOperatorList] = useState<Operator[]>([]);
    const [operator, setOperator] = useState<string>('');
    const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
    const [profileList, setProfileList] = useState<Profile[]>([]);
    const [profile, setProfile] = useState<string>('');
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const fetchListOperator = async () => {
        try {
            const getListOperator = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-operator`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            });
            if(getListOperator.data.success) {
                setOperatorList(getListOperator.data.operators);
            }
            else { 
                setOperatorList([]);
                alert(getListOperator.data.message);
            }
        }
        catch (error) { 
            console.error("Error fetching operator list:", error);
        }
    }

    const fetchListProfile = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const getListProfile = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-profile/${user_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            });
            if(getListProfile.data.success) {
                setProfileList(getListProfile.data.profiles);
            }
            else { 
                setProfileList([]);
                alert(getListProfile.data.message);
            }
        }
        catch (error) { 
            console.error("Error fetching operator list:", error);
        }
    }

    // Update button state
    useEffect(() => {
        fetchListOperator();
        fetchListProfile();

        if (isSingleOperatorMode) {
        setIsButtonDisabled(!operator || selectedProfiles.length === 0);
        } else {
        setIsButtonDisabled(!profile || selectedOperators.length === 0);
        }
    }, [isSingleOperatorMode, selectedOperators.length, selectedProfiles.length, operator, profile]);

    // Toggle mode
    const handleToggleMode = () => {
        setIsSingleOperatorMode(!isSingleOperatorMode);
        fetchListOperator();
        fetchListProfile();
        setShowSuccess(false);
    };

    // Handle checkbox changes
    const handleCheckboxChange = (id: string, type: 'operators' | 'profiles', checked: boolean) => {
        if (type === 'operators') {
        setSelectedOperators(prev =>
            checked ? [...prev, id] : prev.filter(opId => opId !== id)
        );
        } else {
        setSelectedProfiles(prev =>
            checked ? [...prev, id] : prev.filter(profId => profId !== id)
        );
        }
    };    


    return (
        <>
            <div className="head-content flex-row">
                <h1 className="title-nav">{title}</h1>
            </div>

            <div className="box-btn-profile flex-row">
                <div onClick={() => setShowAddProfile(!showAddProfile)} className="open-new-profile">
                    Tạo mới profile
                </div>
                <div onClick={() => setShowAssignProfile(!showAssignProfile)} className="open-assign-profile">
                    Gán Profile cho Operator
                </div>
            </div>


            {showAddProfile && (
            <div className="container-add-profile">
                
                <div className="profile-form-container">
                    <h2>Profile</h2>
                    <form onSubmit={hadleAddProfileSubmit} method="post">
                        <div className="form-group">
                            <label htmlFor="profileName">Tên profile</label>
                            <input
                                type="text"
                                id="profileName"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                placeholder="Nhập tên profile"
                                required
                            />
                        </div>
            
                        <div className="form-group">
                            <label htmlFor="commandList">Chọn danh sách lệnh</label>
                            <select
                                id="commandList"
                                value={commandList}
                                onChange={(e) => setCommandList(e.target.value)}
                                required
                            >
                                <option value="" disabled>Danh sách lệnh</option>
                                {commandLists.map((command) => (
                                    <option key={command.command_list_id} value={command.command_list_id}>{command.name}</option>
                                ))}
                            </select>
                        </div>
            
                        <div className="form-group">
                            <label htmlFor="deviceGroup">Chọn nhóm thiết bị</label>
                            <span className="error-message">{errorGetGroups}</span>
                            <select
                                id="deviceGroup"
                                value={deviceGroup}
                                onChange={(e) => setDeviceGroup(e.target.value)}
                                required
                            >
                                <option value="" disabled>Danh sách nhóm thiết bị</option>
                                {deviceGroups.map((group) => (
                                    <option key={group.device_group_id} value={group.device_group_id}>{group.name}</option>
                                ))}
                            </select>
                        </div>
            
                        <div className="btn-frm-create-profile flex-row">

                            <button type="button" className="cancel-btn" onClick={() => setShowAddProfile(!showAddProfile)}>Hủy bỏ</button>
                            <button type="submit" className="create-profile-btn">Tạo mới profile</button>
                        </div>
                    </form>
                </div> 
            </div>
            )}


            {showAssignProfile && (
                <div className="assign-profile-container">
                    <div className="assign-form-container">
                        <button className="toggle-btn" onClick={handleToggleMode}>
                        {isSingleOperatorMode
                            ? 'Switch to Assign Operators to Profile'
                            : 'Switch to Assign Profiles to Operator'}
                        </button>
                        <h2 className="form-title">
                        {isSingleOperatorMode ? 'Assign Profiles to Operator' : 'Assign Operators to Profile'}
                        </h2>
                        <form method="post">
                        <div className="form-group">
                            {isSingleOperatorMode ? (
                            <>
                                <label htmlFor="operatorSelect">Danh sách Operator</label>
                                <select
                                id="operatorSelect"
                                value={operator}
                                onChange={e => setOperator(e.target.value)}
                                required
                                >
                                <option value="" disabled>
                                    Chọn operator
                                </option>
                                {operatorList.map(operator => (
                                    <option key={operator.user_id} value={operator.user_id}>{operator.username}</option>
                                ))}
                                </select>
                            </>
                            ) : (
                            <>
                                <label>Danh sách Operator</label>
                                <div className="checkbox-group">
                                    {operatorList.map(operator => (
                                        <label key={operator.user_id}>
                                        <input
                                            type="checkbox"
                                            value={operator.user_id}
                                            checked={selectedOperators.includes(operator.user_id.toString())}
                                            onChange={e => handleCheckboxChange(operator.user_id.toString(), 'operators', e.target.checked)}
                                        />
                                        {operator.username}
                                        </label>
                                    ))}
                                </div>
                            </>
                            )}
                        </div>
                        <div className="form-group">
                            {isSingleOperatorMode ? (
                            <>
                                <label>Danh sách profile</label>
                                <div className="checkbox-group">
                                {profileList.map(profile => (
                                    <label key={profile.profile_id}>
                                    <input
                                        type="checkbox"
                                        value={profile.profile_id}
                                        checked={selectedProfiles.includes(profile.profile_id.toString())}
                                        onChange={e => handleCheckboxChange(profile.profile_id.toString(), 'profiles', e.target.checked)}
                                    />
                                    {profile.name}
                                    </label>
                                ))}
                                </div>
                            </>
                            ) : (
                            <>
                                <label htmlFor="profileSelect">Select Profile</label>
                                <select
                                id="profileSelect"
                                value={profile}
                                onChange={e => setProfile(e.target.value)}
                                required
                                >
                                <option value="" disabled>
                                    Chọn profile
                                </option>
                                {profileList.map(profile => (
                                    <option key={profile.profile_id} value={profile.profile_id}>{profile.name}</option>
                                ))}
                                </select>
                            </>
                            )}
                        </div>
                        <div className="flex-row">
                            <button onClick={() => setShowAssignProfile(!showAssignProfile)} className="btn-close-assign">Đóng</button>
                            <button
                                type="submit"
                                className="assign-profile-btn"
                                disabled={isButtonDisabled}
                            >
                                {isSingleOperatorMode ? 'Assign Profiles' : 'Assign Profile'}
                            </button>
                        </div>
                        </form>
                        {showSuccess && <div className="success-message">Assignment successful!</div>}
                    </div>
            </div>
            )}
        </>
    );
}


export default ProfilePage;