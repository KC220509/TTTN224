
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles/device-group.css';
import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Device {
  device_id: number; 
  name: string;
  ip_address: string;
}
const DeviceDeviceGroup = () => {


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
  const handleAddDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      const resAddDevice = await axios.post('http://127.0.0.1:8000/api/teamlead/create-device',{
        name: name,
        ip_address: ip_address,
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
            setSuccess(null);
          }
          , 2000);

        }
      }catch(err){
        setSuccess('');
        setTimeout(() => {
            if (axios.isAxiosError(err) && err.response?.data?.errors?.ip_address) {
              setError(err.response.data.errors.ip_address[0]);
            } else {
              setError('Đã xảy ra lỗi không xác định !');
            }
        }, 2000); 
      }

    }


  return (
    <>
      <div className="device-group-container flex-row">
        <div className="device-group flex-col">
          <div className="device-group-header">Devices</div>
          <div className="device-group-content flex-col">
            
            {devices.map((device) => (
              <div key={device.device_id} className="device-group-item flex-row">
                <div className="item-name">{device.name}</div>
                <div className="item-ip_address">{device.ip_address}</div>
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
            
           
              <div  className="device-group-item flex-row">
                <div className="item-name">Routers</div>
              </div>
              <div  className="device-group-item flex-row">
                <div className="item-name">Switchs</div>
              </div>
          </div>
          {success && <p style={{color: '#00ff37',textAlign: 'center', fontWeight: 'bold'}}>{success}</p>}
          <div className="device-group-footer">
            <button className="btn-open-addGroup">
              <FontAwesomeIcon icon={faPlus} className='icon' />
              Add Group
            </button>
          </div>
        </div>
      </div>

      <div className={`add-device-container ${showAddDevice ? 'showAddDevice' : ''}`}>
        <form onSubmit={handleAddDevice} className='form-add-device flex-col'>
          <div className="form-header flex-row">
            <h2>Thêm thiết bị</h2>
            <FontAwesomeIcon icon={faXmark} className='icon' onClick={() => setShowAddDevice(!showAddDevice)} />
          </div>
          <div className="form-body flex-col">
            <label htmlFor="name">Device Name:</label>
            <input onChange={(e) => setDeviceName(e.target.value)} type="text" id="name" name="name" required />

            <label htmlFor="ip-address">IP Address:</label>
            <input onChange={(e) => setIpAddress(e.target.value)} type="text" id="ip-address" name="ip-address" required />

            <button type="submit" className='btn-add-device'>Thêm mới</button>
          </div>
          {error && <p style={{color: '#ff0808',textAlign: 'center', fontWeight: 'bold'}}>{error}</p>}
        </form>
      </div>
    </>
  );
}


export default DeviceDeviceGroup;