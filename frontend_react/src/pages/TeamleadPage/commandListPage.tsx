
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { faTerminal, faXmark } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import dayjs from "dayjs";


interface CommandList {
    command_list_id: number;
    name: string;
    description: string;
    commands: string[];
    user_ID: number;
    created_at: string;
}

const CommandListPage = () => {
    const location = useLocation();
    const title = location.state?.title || '';

    const [showFrmNewCommandList, setShowFrmNewCommandList] = useState(false);

    // Get List Command
    const [commandList, setCommandList] = useState<CommandList[]>([]);

    
    const fetchListCommand = async () => {
        try {
            const user_id = localStorage.getItem('user_id');
            const resCommandList = await axios.get(`http://127.0.0.1:8000/api/teamlead/list-command/${user_id}`, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });
            if(resCommandList.data.success) {
                setCommandList(resCommandList.data.command_lists);
            }
            else {
                setCommandList([]);
                alert(resCommandList.data.message);
            }

        } catch (error) {
            console.error("Error fetching command list:", error);
        }
    };

    useEffect(() => {
        fetchListCommand();
    }
    , []);



    
    // Create Command List
    const [nameCommand, setNameCommand] = useState("");
    const [descriptionCommand, setDescriptionCommand] = useState("");
    // const [commands, setCommands] = useState([""]);
    const [commands, setCommands] = useState<string[]>([""]);

    const handleCommandChange = (index: number, newValue: string) => {
        const updatedCommands = [...commands];
        updatedCommands[index] = newValue;
        setCommands(updatedCommands);
    };
    const handleAddCommandInput = () => {
        setCommands([...commands, ""]);
    };
    
    const handleRemoveCommand = (index: number) => {
        const updatedCommands = commands.filter((_, i) => i !== index);
        setCommands(updatedCommands);
    };
    

    const handleAddCommandSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const resAddCommand = await axios.post("http://127.0.0.1:8000/api/teamlead/create-command", {
                name: nameCommand,
                description: descriptionCommand,
                commands: commands,
                user_ID: localStorage.getItem('user_id'),
            },{
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                }
            });

            if(resAddCommand.data.success) {
                alert(resAddCommand.data.message)
                setShowFrmNewCommandList(false);
                fetchListCommand();
                setNameCommand("");
                setDescriptionCommand("");
                setCommands([""]);
            }else{
                alert(resAddCommand.data.message);
            }
        }
        catch (error) {
            console.error("Error adding command list:", error);
            alert("Có lỗi xảy ra khi thêm mới danh sách lệnh!");
        }
    }

    return (
        <>
            <div className="head-content flex-row">
                <h1 className="title-nav">{title}</h1>
            </div>
            <div onClick={() => setShowFrmNewCommandList(!showFrmNewCommandList)} className="action-open-frm">Thêm mới danh sách lệnh</div>
            <div className="command-list-container flex-col">
                <div className="head-container flex-row">
                    <div className="head-title flex-row">
                        <div className="div-item title-name">Tên danh sách lệnh</div>
                        <div className="div-item title-number-command">Số lệnh</div>
                        <div className="div-item title-created">Ngày tạo</div>
                        <div className="div-item title-action">Hoạt động</div>
                    </div>
                </div>
                <div className="content-container flex-col">
                    {commandList.map((commandItem)=>(
                        <div key={commandItem.command_list_id} className="content-item flex-row">
                            <div className="div-item item-name">{commandItem.name}</div>
                            <div className="div-item item-number-command">{commandItem.commands.length}</div>
                            <div className="div-item item-created">{dayjs(commandItem.created_at).format('DD/MM/YYYY')}</div>
                            <div className="div-item item-action">
                                <FontAwesomeIcon className="action-update-command" icon={faPenToSquare} />
                            </div>
                        </div>
                    ))}
                    {commandList.length < 1 &&(
                        <div className="notificate" style={{textAlign: "center"}}>Hiện chưa có lệnh nào</div>
                    )}
                    
                </div>
            </div>

            {showFrmNewCommandList && (
                <div className="container-add-command flex-col">
                    <form onSubmit={handleAddCommandSubmit} className="frm-add-command flex-col" action="" method="post">
                        <h3>Nhập thông tin danh sách lệnh</h3>

                        <div className="div-item flex-col">
                            <label htmlFor="name">Tên danh sách</label>
                            <input className="item-input" type="text" name="name" id="name" placeholder="Nhập tên danh sách lệnh" required 
                                onChange={(e) => setNameCommand(e.target.value)}
                                value={nameCommand}
                            />
                        </div>
                        <div className="div-item flex-col">
                            <label htmlFor="description">Mô tả</label>
                            <textarea className="item-input" rows={3} name="description" id="description" placeholder="Nhập mô tả cho danh sách lệnh" required
                                onChange={(e) => setDescriptionCommand(e.target.value)}
                                value={descriptionCommand}
                            />
                        </div>
                        <div className="div-item flex-col">
                            <label htmlFor="commands">Danh sách lệnh</label>
                            <div className="command-item-container flex-col">
                                {commands.map((command, index) => (
                                    <div key={index} className="command-item flex-row">
                                        <FontAwesomeIcon className="icon-command icon-ssh" icon={faTerminal} />
                                        <input className="item-input-ssh" type="text" name="commands" id="commands" placeholder="Nhập lệnh ssh" required
                                            value={command}
                                            onChange={(e) => handleCommandChange(index, e.target.value)}
                                        />
                                        {commands.length > 1 && (
                                            <FontAwesomeIcon onClick={() => handleRemoveCommand(index)} className="icon-command icon-remove" icon={faXmark} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <div className="add-row-command" onClick={handleAddCommandInput}>Thêm lệnh</div>
                        </div>
                        <div className="btn-box flex-row">
                            <button className="btn-frm btn-cancel-command" type="button" onClick={() => setShowFrmNewCommandList(!showFrmNewCommandList)}>Hủy bỏ</button>
                            <button className="btn-frm btn-add-command" type="submit">Thêm mới</button>
                        </div>
                    </form>
                </div>
            )}

           
        </>
    );
}


export default CommandListPage;