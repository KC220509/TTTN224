
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { faTerminal, faXmark } from "@fortawesome/free-solid-svg-icons";

const CommandListPage = () => {
    const location = useLocation();
    const title = location.state?.title || '';

    const [showFrmNewCommandList, setShowFrmNewCommandList] = useState(false);

    const [commands, setCommands] = useState([""]);

    const handleCommandChange = (index: number, value: string) => {
        const updated = [...commands];
        updated[index] = value;
        setCommands(updated);
    };

    const handleAddCommand = () => {
        setCommands([...commands, ""]);
    };

    const handleRemoveCommand = (index: number) => {
        const updated = commands.filter((_, i) => i !== index);
        setCommands(updated);
    };

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
                    <div className="content-item flex-row">
                        <div className="div-item item-name">Reboot Device</div>
                        <div className="div-item item-number-command">3</div>
                        <div className="div-item item-created">07/05/2025</div>
                        <div className="div-item item-action">
                            <FontAwesomeIcon className="action-update-command" icon={faPenToSquare} />
                        </div>
                    </div>
                    
                    <div className="content-item flex-row">
                        <div className="div-item item-name">Reboot Device</div>
                        <div className="div-item item-number-command">3</div>
                        <div className="div-item item-created">07/05/2025</div>
                        <div className="div-item item-action">
                            <FontAwesomeIcon icon={faPenToSquare} />
                        </div>
                    </div>
                </div>
            </div>

            {showFrmNewCommandList && (
                <div className="container-add-command flex-col">
                    <form className="frm-add-command flex-col" action="" method="post">
                        <h3>Nhập thông tin danh sách lệnh</h3>

                        <div className="div-item flex-col">
                            <label htmlFor="name">Tên danh sách</label>
                            <input className="item-input" type="text" name="name" id="name" placeholder="Nhập tên danh sách lệnh" required />
                        </div>
                        <div className="div-item flex-col">
                            <label htmlFor="description">Mô tả</label>
                            <textarea className="item-input" rows={3} name="description" id="description" placeholder="Nhập mô tả cho danh sách lệnh" required/>
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
                            
                            <div className="add-row-command" onClick={handleAddCommand}>Thêm lệnh</div>
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