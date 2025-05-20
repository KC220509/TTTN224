
import './styles/op_profile.css'
// export default SendSSHPage;
import { useEffect, useRef, useState } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import axios from "axios";
import { useLocation } from 'react-router-dom';

interface Profile {
    profile_id: number;
    profile_name: string;
    device_group_id: number;
    device_group_name: number;
    command_list_name: number;
}

interface Device {
    device_id: number;
    device_name: string;
    ip_address: number;
    ssh_port: string;
    device_group_ID: number;
}
const ConnectProfilePage = () => {
  const location = useLocation();
  const title = location.state?.title || '';

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [indexProfile, setIndexProfle] = useState<Profile | null>(null);
  const [listDeviceAssign, setListDeviceAssign] = useState<Device[]>([]);

  const [showConnectDevice, setShowConnectDevice] = useState(false);
  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [showTerminal, setShowTerminal] = useState(false);

  
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon>(new FitAddon());

  const getProfiles = async () => {
    try {
      const user_id = localStorage.getItem("user_id");
      const resProfiles = await axios.get(`http://127.0.0.1:8000/api/operator/list-profile/${user_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if(resProfiles.data.success)  {
        setProfiles(resProfiles.data.listProfile);
      }
      else {
        setProfiles([]);
        console.error("Error fetching profiles:", resProfiles.data.message);
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    }
  }



  const getListDeviceAssign = async () => {
    try {
      const resListDevice = await axios.get(`http://127.0.0.1:8000/api/operator/list-device-assign`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if(resListDevice.data.success)  {
        setListDeviceAssign(resListDevice.data.listDeviceAssign);
      }
      else {
        setListDeviceAssign([]);
        console.error("Error fetching list device:", resListDevice.data.message);
      }
    } catch (error) {
      console.error("Error fetching list device:", error);
    }

  }

  useEffect(() => {
    getProfiles();
    getListDeviceAssign();
    
  }, []);
  

  useEffect(() => {
    if (indexProfile && terminalRef.current ) {
      term.current = new Terminal({
        
        cursorBlink: true,
        fontSize: 14,
        theme: {
          background: "#000000",
          foreground: "#00ff00",
        },
      });

      term.current.loadAddon(fitAddon.current);
      term.current.open(terminalRef.current);
      fitAddon.current.fit();

      term.current.writeln("Welcome to the SSH Terminal!");
      term.current.writeln(`Connecting to profile: ${indexProfile.profile_name}`);
      term.current.write("$ ");

      let input = "";

      term.current.onKey(({ key, domEvent }) => {
        const char = key;

        if (domEvent.key === "Enter") {
          term.current?.writeln("");
          term.current?.writeln(`You typed: ${input}`);
          input = "";
          term.current?.write("$ ");
        } else if (domEvent.key === "Backspace") {
          if (input.length > 0) {
            input = input.slice(0, -1);
            term.current?.write("\b \b");
          }
        } else if (domEvent.key.length === 1) {
          input += char;
          term.current?.write(char);
        }
      });

      const handleResize = () => fitAddon.current.fit();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        term.current?.dispose();
      };
    }
  }, [indexProfile]);


  const handleProfileClick = (profile: Profile) => {
    setIndexProfle(profile);
    setShowConnectDevice(!showConnectDevice);
  };


  const handleConnectDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setConnectSuccess('Connect device thành công');
    setTimeout(() => {
      setConnectSuccess(null);
    }
    , 1000);

    setShowTerminal(true);
  }

  const handleCloseTerminal = () => {
    setIndexProfle(null);
    setShowTerminal(false);
    setShowConnectDevice(!showConnectDevice);
  }

  return (
    <>  
      <div className="head-content flex-row">
        <h1 className="title-nav">{title}</h1>
      </div>
      <div className="op-container-connect flex-row">
        <table className="list-profile-op">
          <thead>
            <tr>
              <th className="op_profile_name">Tên profile</th>
              <th className="op_group_name">Nhóm thiết bị</th>
              <th className="op_command_name">Danh sách lệnh</th>
              <th className="op_detail_name"></th>
            </tr>
          </thead>
          <tbody>
            {profiles.length > 0 ? (
              profiles.map((profile) => (
                <tr key={profile.profile_id}>
                  <td className="op_profile_name">{profile.profile_name}</td>
                  <td className="op_group_name">{profile.device_group_name}</td>
                  <td className="op_command_name">{profile.command_list_name}</td>
                  <td className="op_detail_name" onClick={() => handleProfileClick(profile)}>
                    Chi tiết
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>Không có profiles nào</td>
              </tr>
            )}
          </tbody>
        </table>
        {showConnectDevice && (
          <div className='container-terminal-op flex-col'>
            
            <h1 className='title-terminal'>Send SSH Device in {indexProfile ? indexProfile.profile_name : ''}</h1>
            <form method='post' className='form-connect flex-row' onSubmit={handleConnectDevice}>
              <span>Kết nối thiết bị:</span>

              <div className="list-device-assign">
                <select className='frm-sshport' name="" id="">
                  <option value="">Danh sách thiết bị</option>
                  {listDeviceAssign.length > 0 ? 
                    (
                      listDeviceAssign
                        .filter(deviceAssign => deviceAssign.device_group_ID === indexProfile?.device_group_id)
                        .map(deviceAssign => (
                            <option key={deviceAssign.device_id} value={deviceAssign.device_id}>{deviceAssign.device_name}</option>
                        ))
                      )
                      : (
                        <option value="">Không có thiết bị nào</option>
                      )
                    }
                </select>
              </div>
              <button className='btn-connect-deivce' type="submit">Connect</button>

              {connectError && <p style={{color: 'red',textAlign: 'right', fontWeight: 'bold'}}>{connectError}</p>}
              {connectSuccess && <p style={{color: 'green',textAlign: 'right', fontWeight: 'bold'}}>{connectSuccess}</p>}

              <span onClick={() => handleCloseTerminal()} className='btn-close-connect'>Đóng</span>

            </form>
            {/* {showTerminal && ( */}
              <div className='terminal-content' ref={terminalRef}
                style={
                  showTerminal
                    ? { pointerEvents: "auto" }
                    : { pointerEvents: "none", opacity: 0.5 }
                }
              >
              </div>
            {/* )} */}

          </div>
        )}
      </div>
    </>
  );
};

export default ConnectProfilePage;
