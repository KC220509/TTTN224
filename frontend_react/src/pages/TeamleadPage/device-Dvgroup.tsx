
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/device-group.css';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

interface Device {
  device_id: number; 
  name: string;
  ip_address: string;
  ssh_port: string;
}

interface DeviceGroup {
  device_group_id: number;
  name: string;
}
const DeviceDeviceGroup = () => {
  const location = useLocation();
  const title = location.state?.title || '';

  const [devices, setDevices] = useState<Device[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  

  
    const fetchListDevice = async () => {
      try{
        const user_id = localStorage.getItem("user_id");
        const resListDevice = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-device/${user_id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });

        if(resListDevice.data.success){
          setDevices(resListDevice.data.devices);
        }
        else{
          setError(resListDevice.data.message);
        }
      }
      catch{
        setError("Lỗi gọi API");
      }
    }
    
  useEffect(() => {
    fetchListDevice();
  },[]);


  const [showAddDevice, setShowAddDevice] = useState(false);
  const [name, setDeviceName] = useState('');
  const [ip_address, setIpAddress] = useState('');
  const [ssh_port, setSsh_port] = useState('');

  const handleAddDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try{
      const resCheckIp = await axios.post("http://127.0.0.1:8000/api/teamlead/check-device", {
        name: name,
        ip_address: ip_address,
        ssh_port: ssh_port,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (resCheckIp.data.status === "online") {
        const resAddDevice = await axios.post('http://127.0.0.1:8000/api/teamlead/create-device',{
          name: name,
          ip_address: resCheckIp.data.ip,
          ssh_port: ssh_port,
          user_ID: localStorage.getItem("user_id"),
          
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          })
          if(resAddDevice.data.success){
            setShowAddDevice(false);
            setDeviceName('');
            setIpAddress('');
            fetchListDevice();
            (e.target as HTMLFormElement).reset();
            setError('');
            setSuccess(resAddDevice.data.message);
            setTimeout(() => {
              setSuccess('');
            }
            , 2000);
    
          }
      }else{
        setError("Không thể kết nối đến thiết bị. Vui lòng kiểm tra lại.");
        setTimeout(() => {
          setError('');
        }, 2000);
      }

    }catch(err){
      setSuccess('');
      setTimeout(() => {
          if (axios.isAxiosError(err) && err.response?.data?.errors?.ip_address) {
            setError(err.response.data.errors.ip_address[0]);
          } else {
            setError("Không thể kết nối đến thiết bị. Vui lòng kiểm tra lại.");
          }
      }, 3000); 
    }
  };

  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const fetchListGroup = async () => {
    try{
      const user_id = localStorage.getItem("user_id");
      const resListDevice = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-group/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if(resListDevice.data.success){
        setGroups(resListDevice.data.groups);
      }
      else{
        setError(resListDevice.data.message);
      }
    }
    catch{
      setError("Lỗi gọi API");
    }
  }
  
  useEffect(() => {
    fetchListGroup();
  },[]);

  const [showAddGroup, setShowAddGroup] = useState(false);
  const [successAddGr, setSuccessAddGr] = useState<string | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedDevicesID, setSelectedDevicesID] = useState<number[]>([]);

  const handleCheckboxChange = (deviceId: number) => {
    setSelectedDevicesID((prev) =>
      prev.includes(deviceId)
        ? prev.filter((id) => id !== deviceId)
        : [...prev, deviceId]
    );
  };
  

  const handleAddGroup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const resAddGroup = await axios.post('http://127.0.0.1:8000/api/teamlead/create-group',{
        name: `${groupName}_${localStorage.getItem("user_id")}`,
        deviceList : selectedDevicesID.map(id => ({ device_id: id })),
        user_ID: localStorage.getItem("user_id"),
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      })

      if(resAddGroup.data.success){
        setShowAddGroup(false);
        setGroupName('');
        setSelectedDevicesID([]);
        fetchListGroup();
        (e.target as HTMLFormElement).reset();
        setError('');
        setSuccessAddGr(resAddGroup.data.message);
        setTimeout(() => {
          setSuccessAddGr('');
        }
        , 2000);
      }
    }
    catch (err) {
      setSuccessAddGr('');
      if (axios.isAxiosError(err) && err.response?.data?.errors?.name) {
        setError(err.response.data.errors.name[0]);
      }else {
        setError("Tạo nhóm thiết bị không thành công.");
      }
    }
  };


  return (
    <>
      <div className="head-content flex-row">
        <h1 className="title-nav">{title}</h1>
      </div>
      <div className="device-group-container flex-row">
        <div className="device-group flex-col">
          <div className="device-group-header">Danh sách thiết bị</div>
          <div className="device-group-content flex-col">
            {devices.map((device) => (
              <div key={device.device_id} className="device-group-item flex-row">
                <div className="item-name">{device.name}</div>
                <div className="item-ip_address">{device.ip_address}:{device.ssh_port}</div>
              </div>
            ))}
          </div>
          {success && <p style={{color: '#00ff37',textAlign: 'center', fontWeight: 'bold'}}>{success}</p>}
          <div className="device-group-footer">
            <button onClick={() => setShowAddDevice(!showAddDevice)} className="btn-open-addDevice">
              <FontAwesomeIcon icon={faPlus} className='icon' />
              Add Device
            </button>
          </div>
        </div>
        <div className="device-group flex-col">
          <div className="device-group-header">Device Group</div>
          <div className="device-group-content flex-col">
            {groups.map((group) => (
              <div key={group.device_group_id} className="device-group-item flex-row">
                <div className="item-name">{group.name}</div>
              </div>
            ))}
          </div>
          {successAddGr && <p style={{color: '#00ff37',textAlign: 'center', fontWeight: 'bold'}}>{successAddGr}</p>}
          <div className="device-group-footer">
            <button onClick={() => setShowAddGroup(!showAddGroup)} className="btn-open-addGroup">
              <FontAwesomeIcon icon={faPlus} className='icon' />
              Add Group
            </button>
          </div>
        </div>
      </div>

      {showAddDevice && (
        <div className='add-device-container'>
          <form onSubmit={handleAddDevice} className='form-add-device flex-col'>
            <div className="form-header flex-row">
              <h2>Thêm thiết bị</h2>
              <FontAwesomeIcon icon={faXmark} className='icon' onClick={() => setShowAddDevice(!showAddDevice)} />
            </div>
            <div className="form-body flex-col">
              <label htmlFor="name">Tên thiết bị:</label>
              <input onChange={(e) => setDeviceName(e.target.value)} type="text" id="name" name="name" required />

              <label htmlFor="ip-address">IP Sever:</label>
              <input onChange={(e) => setIpAddress(e.target.value)} type="text" id="ip-address" name="ip-address" required />

              <label htmlFor="ssh_port">SSH_Port:</label>
              <input onChange={(e) => setSsh_port(e.target.value)} type="text" id="ssh_port" name="ssh_port" required />

              <button type="submit" className='btn-add-device'>Thêm mới</button>
            </div>
            {error && <p style={{color: '#ff0808',textAlign: 'center', fontWeight: 'bold'}}>{error}</p>}
          </form>
        </div>
      )}


      {showAddGroup && (
        <div className='add-group-container'>
          <form onSubmit={handleAddGroup} className='form-add-group flex-col'>
            <div className="form-header flex-row">
              <h2>Thêm nhóm thiết bị</h2>
              <FontAwesomeIcon icon={faXmark} className='icon' onClick={() => setShowAddGroup(!showAddGroup)} />
            </div>
            <div className="form-body flex-col">
              <label htmlFor="name">Tên nhóm:</label>
              <input onChange={(e) => setGroupName(e.target.value)} type="text" id="name" name="name" required />

              <label className='device-list-title'>Danh sách thiết bị:</label>
              <div className="device-list flex-col">
                {devices.map((device) => (
                  <div className='device-item flex-row' key={device.device_id}>
                    <input type="checkbox" name="device_id" id={`device_id_${device.device_id}`} className='device-id-check'
                      checked={selectedDevicesID.includes(device.device_id)}
                      onChange={() => {handleCheckboxChange(device.device_id)}}
                    />
                    <span className='device-name-span'>{device.name} - {device.ip_address}:{device.ssh_port}</span>
                  </div>
                ))}
              </div>

              <button type="submit" className='btn-add-group'>Thêm mới</button>
            </div>
            {error && <p style={{color: '#ff0808',textAlign: 'center', fontWeight: 'bold'}}>{error}</p>}
          </form>
        </div>
      )}
    </>
  );
}


export default DeviceDeviceGroup;