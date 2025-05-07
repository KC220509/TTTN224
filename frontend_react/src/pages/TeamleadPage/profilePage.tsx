import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";


interface DeviceGroup {
    device_group_id: number;
    name: string;
}


interface Operator {
    id: string;
    name: string;
  }
  
  interface Profile {
    id: string;
    name: string;
  }
  
  // Sample data
  const operators: Operator[] = [
    { id: 'operator1', name: 'John Doe' },
    { id: 'operator2', name: 'Jane Smith' },
    { id: 'operator3', name: 'Alex Johnson' },
    { id: 'operator4', name: 'John Doe' },
    { id: 'operator5', name: 'Jane Smith' },
    { id: 'operator6', name: 'Alex Johnson' },
  ];
  
  const profiles: Profile[] = [
    { id: 'profile1', name: 'Admin' },
    { id: 'profile2', name: 'Editor' },
    { id: 'profile3', name: 'Viewer' },
    { id: 'profile4', name: 'Manager' },
    { id: 'profile5', name: 'Analyst' },
    { id: 'profile6', name: 'Guest' },
    { id: 'profile7', name: 'Moderator' },
    { id: 'profile8', name: 'Developer' },
    { id: 'profile9', name: 'Support' },
    { id: 'profile10', name: 'Tester' },
  ];
  
  

const ProfilePage = () => {
    const location = useLocation();
    const title = location.state?.title || '';

    const [errorGetGroups, setErrorGetGroups] = useState('');


    const [showAddProfile, setShowAddProfile] = useState(false);
    const [showAssignProfile, setShowAssignProfile] = useState(false);

    // Create Profile
    const [profileName, setProfileName] = useState('');
    const [commandList, setCommandList] = useState('');
    const [deviceGroups, setDeviceGroups] = useState<DeviceGroup[]>([]);
    const [deviceGroup, setDeviceGroup] = useState('')

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
      fetchListGroup();
    },[]);
    
    // Assign Profile
    const [isSingleOperatorMode, setIsSingleOperatorMode] = useState<boolean>(true);
    const [selectedOperator, setSelectedOperator] = useState<string>('');
    const [selectedProfile, setSelectedProfile] = useState<string>('');
    const [selectedOperators, setSelectedOperators] = useState<string[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    // Update button state
    useEffect(() => {
        if (isSingleOperatorMode) {
        setIsButtonDisabled(!selectedOperator || selectedProfiles.length === 0);
        } else {
        setIsButtonDisabled(!selectedProfile || selectedOperators.length === 0);
        }
    }, [isSingleOperatorMode, selectedOperator, selectedProfile, selectedProfiles, selectedOperators]);

    // Toggle mode
    const handleToggleMode = () => {
        setIsSingleOperatorMode(!isSingleOperatorMode);
        setSelectedOperator('');
        setSelectedProfile('');
        setSelectedOperators([]);
        setSelectedProfiles([]);
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
                    <form method="post">
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
                                    <option value="command1">Command 1</option>
                                    <option value="command2">Command 2</option>
                                    <option value="command3">Command 3</option>
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

                            <button type="submit" className="cancel-btn" onClick={() => setShowAddProfile(!showAddProfile)}>Hủy bỏ</button>
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
                                value={selectedOperator}
                                onChange={e => setSelectedOperator(e.target.value)}
                                required
                                >
                                <option value="" disabled>
                                    Chọn operator
                                </option>
                                {operators.map(op => (
                                    <option key={op.id} value={op.id}>
                                    {op.name}
                                    </option>
                                ))}
                                </select>
                            </>
                            ) : (
                            <>
                                <label>Select Operator Users</label>
                                <div className="checkbox-group">
                                {operators.map(op => (
                                    <label key={op.id}>
                                    <input
                                        type="checkbox"
                                        value={op.id}
                                        checked={selectedOperators.includes(op.id)}
                                        onChange={e => handleCheckboxChange(op.id, 'operators', e.target.checked)}
                                    />
                                    {op.name}
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
                                {profiles.map(prof => (
                                    <label key={prof.id}>
                                    <input
                                        type="checkbox"
                                        value={prof.id}
                                        checked={selectedProfiles.includes(prof.id)}
                                        onChange={e => handleCheckboxChange(prof.id, 'profiles', e.target.checked)}
                                    />
                                    {prof.name}
                                    </label>
                                ))}
                                </div>
                            </>
                            ) : (
                            <>
                                <label htmlFor="profileSelect">Select Profile</label>
                                <select
                                id="profileSelect"
                                value={selectedProfile}
                                onChange={e => setSelectedProfile(e.target.value)}
                                required
                                >
                                <option value="" disabled>
                                    Chọn profile
                                </option>
                                {profiles.map(prof => (
                                    <option key={prof.id} value={prof.id}>
                                    {prof.name}
                                    </option>
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