
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


interface Info{
  username: string;
  password: string;
  host: string;
  port: number;
  command: string;
}

const ConnectProfilePage = () => {
  const location = useLocation();
  const title = location.state?.title || '';

  const [connectSuccess, setConnectSuccess] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [indexProfile, setIndexProfle] = useState<Profile | null>(null);
  const [listDeviceAssign, setListDeviceAssign] = useState<Device[]>([]);
  
  const [showConnectDevice, setShowConnectDevice] = useState(false);

  const [showTerminal, setShowTerminal] = useState(false);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [host, setHost] = useState<string>('');
  const [port, setPort] = useState<string>('');

  const [deviceConnect, setDeviceConnect] = useState<string | null>(null);
  const [info, setInfo] = useState<Info | null>(null);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const term = useRef<Terminal | null>(null);
  const fitAddon = useRef<FitAddon>(new FitAddon());
  // const terminalRef = useRef(null);
  // const term = useRef(null);
  // const fitAddon = useRef(new FitAddon());
  const ws = useRef<WebSocket | null>(null);
  // const commandBuffer = useRef("");





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

  const handleConnectDevice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      
      const connectDevice = await axios.post('http://127.0.0.1:8000/api/operator/connect-device', {
          username: username,
          password: password,
          host: host,
          port: port,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (connectDevice.data.success) {
        setShowTerminal(true);
        setDeviceConnect(connectDevice.data.device_name);
        setInfo(connectDevice.data.info);
        setConnectError(null);
        setConnectSuccess(connectDevice.data.message);
        setTimeout(() => {
          setConnectSuccess(null);
        }
        , 2000);

      }else {
        setConnectSuccess(null);
        setConnectError(connectDevice.data.message);
        setTimeout(() => {
          setConnectError(null);
        }
        , 2000);
      }
    } catch (error) {
      console.error("Error connecting to device:", error);
      setConnectSuccess(null);
      setConnectError("Lỗi kết nối đến thiết bị");
      setTimeout(() => {
        setConnectError(null);
      }
      , 2000);
    }

  }

  useEffect(() => {
    if (indexProfile && terminalRef.current && info) {
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
      term.current.writeln(`Connecting to device: ${deviceConnect}`);

      // Kết nối WebSocket
      ws.current = new WebSocket("ws://127.0.0.1:9000");

      ws.current.onopen = () => {
        // Gửi thông tin kết nối SSH
        if (ws.current) {
          ws.current.send(
            JSON.stringify({
              action: "connect",   // sửa type thành action
              host: info.host,
              port: info.port,
              username: info.username,
              password: info.password,
            })
          );
        }
      };

      ws.current.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        // Xử lý output từ server
        if (msg.output) {
          if (term.current) term.current.write(msg.output);
        } else if (msg.success) {
          if (term.current) {
            term.current.writeln(msg.success);
            
          }
        } else if (msg.error) {
          if (term.current) term.current.writeln(`Error: ${msg.error}`);
        }
      };

      ws.current.onerror = () => {
        if (term.current) {
          term.current.writeln(`WebSocket error occurred`);
        }
      };

      ws.current.onclose = () => {
        if (term.current) {
          term.current.writeln("\nConnection closed");
        }
      };

      // Xử lý input từ bàn phím terminal
      term.current.onKey(({ key, domEvent }) => {
        if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

        if (domEvent.key === "Enter") {
          ws.current.send(JSON.stringify({ action: "input", data: "\r\n" }));


        } else if (domEvent.key === "Backspace") {
          ws.current.send(JSON.stringify({ action: "input", data: "\x7f" })); // DEL char (ESC code)
        } else if (domEvent.key.length === 1) {
          ws.current.send(JSON.stringify({ action: "input", data: key }));
        }
      });

      const handleResize = () => fitAddon.current.fit();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        if (ws.current) {
          ws.current.close();
        }
        if (term.current) {
          term.current.dispose();
        }
      };
    }
  }, [indexProfile, deviceConnect, info]);



  const handleProfileClick = (profile: Profile) => {
    setIndexProfle(profile);
    setShowConnectDevice(!showConnectDevice);
  };


  

  const handleCloseTerminal = () => {
    setIndexProfle(null);
    setDeviceConnect(null);
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
              <input type="text" id='username' name='username' placeholder='Tên đăng nhập' required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input type="password" id='password' name='password' placeholder='Mật khẩu' required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input type="text" id='host' name='host' placeholder='Địa chỉ IP' required 
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />

              

              <div className="list-device-assign">
                <select className='frm-sshport' value={port} onChange={(e) => setPort(e.target.value)} required>
                  <option value="">Danh sách thiết bị</option>
                  {listDeviceAssign.length > 0 ? 
                    (
                      listDeviceAssign
                        .filter(deviceAssign => deviceAssign.device_group_ID === indexProfile?.device_group_id)
                        .map(deviceAssign => (
                            <option key={deviceAssign.ssh_port} value={deviceAssign.ssh_port}>{deviceAssign.device_name}</option>
                        ))
                      )
                      : (
                        <option value="">Không có thiết bị nào</option>
                      )
                    }
                </select>
              </div>
              <button className='btn-connect-deivce' type="submit">Connect</button>


              <span onClick={() => handleCloseTerminal()} className='btn-close-connect'>Đóng</span>

            </form>
            {connectError && <p style={{color: 'red', fontWeight: 'bold'}}>{connectError}</p>}
            {connectSuccess && <p style={{color: 'green', fontWeight: 'bold'}}>{connectSuccess}</p>}
            
            <div className='terminal-content' ref={terminalRef}
              style={
                showTerminal
                  ? { pointerEvents: "auto" }
                  : { pointerEvents: "none", opacity: 0.5 }
              }
            >
            </div>

          </div>
        )}
      </div>
    </>
  );
};

export default ConnectProfilePage;